import { prisma } from '@/lib/prisma';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRequestBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_FILE_SIZE + 1024 * 1024) {
        reject(new Error('El archivo no debe superar 5MB.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseContentDisposition(value = '') {
  return value.split(';').reduce((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawValue.length) return acc;
    acc[rawKey] = rawValue.join('=').replace(/^"|"$/g, '');
    return acc;
  }, {});
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:(?:"([^"]+)")|([^;]+))/i);
  if (!boundaryMatch) throw new Error('Formulario inválido.');

  const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;
  const body = buffer.toString('binary');
  const parts = body.split(boundary).slice(1, -1);
  const fields = {};
  let file = null;

  parts.forEach((part) => {
    const cleanPart = part.replace(/^\r\n/, '').replace(/\r\n$/, '');
    const separatorIndex = cleanPart.indexOf('\r\n\r\n');
    if (separatorIndex === -1) return;

    const rawHeaders = cleanPart.slice(0, separatorIndex);
    const rawContent = cleanPart.slice(separatorIndex + 4);
    const headers = rawHeaders.split('\r\n').reduce((acc, line) => {
      const [key, ...rest] = line.split(':');
      acc[key.toLowerCase()] = rest.join(':').trim();
      return acc;
    }, {});

    const disposition = parseContentDisposition(headers['content-disposition']);
    if (!disposition.name) return;

    if (disposition.filename) {
      file = {
        fieldName: disposition.name,
        filename: disposition.filename,
        contentType: headers['content-type'] || 'application/octet-stream',
        buffer: Buffer.from(rawContent, 'binary'),
      };
      return;
    }

    fields[disposition.name] = Buffer.from(rawContent, 'binary').toString('utf8');
  });

  return { fields, file };
}

function sanitizeSegment(value, fallback) {
  return String(value || fallback)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_./]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-/.]+|[-/.]+$/g, '') || fallback;
}

async function logMediaUpload(payload) {
  try {
    await prisma.activityLog.create({
      data: {
        action: 'UPLOAD_MEDIA',
        details: JSON.stringify(payload),
        userName: 'Sistema ERP',
        target: payload.filename,
        module: 'Media',
      },
    });
  } catch (error) {
    // La carga de media no debe fallar si el log no se puede registrar.
  }
}

async function uploadToVercelBlob(pathname, file) {
  const moduleName = '@vercel/blob';
  const { put } = await import(moduleName);

  return put(pathname, file.buffer, {
    access: 'public',
    contentType: file.contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: true,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ message: 'Falta configurar BLOB_READ_WRITE_TOKEN en Vercel.' });
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ message: 'El formulario debe ser multipart/form-data.' });
    }

    const buffer = await readRequestBuffer(req);
    const { fields, file } = parseMultipart(buffer, contentType);

    if (!file) return res.status(400).json({ message: 'Debe adjuntar un archivo.' });
    if (!ALLOWED_IMAGE_TYPES.includes(file.contentType)) {
      return res.status(400).json({ message: 'Solo se permiten imágenes JPEG, PNG, WEBP o AVIF.' });
    }
    if (file.buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ message: 'El archivo no debe superar 5MB.' });
    }

    const scope = sanitizeSegment(fields.scope, 'general');
    const folder = sanitizeSegment(fields.folder, scope);
    const filename = sanitizeSegment(file.filename, `media-${Date.now()}`);
    let metadata = {};

    try {
      metadata = fields.metadata ? JSON.parse(fields.metadata) : {};
    } catch (error) {
      metadata = {};
    }

    const pathname = `${folder}/${Date.now()}-${filename}`;
    const blob = await uploadToVercelBlob(pathname, file);

    const payload = {
      url: blob.url,
      pathname: blob.pathname || pathname,
      filename: file.filename,
      contentType: file.contentType,
      size: file.buffer.length,
      alt: fields.alt || '',
      scope,
      folder,
      metadata,
      uploadedAt: new Date().toISOString(),
    };

    await logMediaUpload(payload);

    return res.status(201).json(payload);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error al subir archivo.' });
  }
}
