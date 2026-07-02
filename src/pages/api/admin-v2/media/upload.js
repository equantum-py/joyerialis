import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 1024 * 1024;

export const config = {
  api: {
    bodyParser: false,
  },
};

class UploadError extends Error {
  constructor(message, statusCode = 400, code = 'UPLOAD_ERROR') {
    super(message);
    this.name = 'UploadError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function safeUploadLog(level, message, context = {}) {
  const safeContext = {
    ...context,
    hasBlobReadWriteToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID),
    nodeEnv: process.env.NODE_ENV,
  };

  // Logs de diagnóstico sin secretos para auditar runtime en Vercel.
  console[level](`[admin-v2/media/upload] ${message}`, safeContext);
}

function readRequestBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let finished = false;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_REQUEST_SIZE) {
        finished = true;
        reject(new UploadError('El archivo no debe superar 5MB.', 413, 'FILE_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!finished) resolve(Buffer.concat(chunks));
    });
    req.on('error', (error) => {
      if (!finished) reject(error);
    });
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
  if (!boundaryMatch) throw new UploadError('Formulario inválido: falta boundary multipart.', 400, 'INVALID_MULTIPART');

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
      if (key) acc[key.toLowerCase()] = rest.join(':').trim();
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
  return (
    String(value || fallback)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-_./]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[-/.]+|[-/.]+$/g, '') || fallback
  );
}

function validateBlobCredentials() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return;

  throw new UploadError(
    'Falta BLOB_READ_WRITE_TOKEN en Vercel para subir a Blob. BLOB_STORE_ID no es suficiente para @vercel/blob put() en este endpoint Pages API.',
    503,
    'BLOB_CREDENTIALS_MISSING'
  );
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
    safeUploadLog('warn', 'ActivityLog falló, la subida se conserva.', {
      errorName: error.name,
      errorCode: error.code,
      message: error.message,
      filename: payload.filename,
    });
  }
}

async function uploadToVercelBlob(pathname, file) {
  validateBlobCredentials();

  return put(pathname, file.buffer, {
    access: 'public',
    contentType: file.contentType,
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

function errorResponse(error) {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'UPLOAD_FAILED';
  const message = statusCode >= 500 && !error.statusCode ? 'Error interno al subir archivo.' : error.message;

  return { statusCode, body: { message, code } };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      throw new UploadError('El formulario debe ser multipart/form-data.', 400, 'INVALID_CONTENT_TYPE');
    }

    const buffer = await readRequestBuffer(req);
    const { fields, file } = parseMultipart(buffer, contentType);

    if (!file) throw new UploadError('Debe adjuntar un archivo.', 400, 'FILE_REQUIRED');

    if (!ALLOWED_IMAGE_TYPES.includes(file.contentType)) {
      throw new UploadError('Solo se permiten imágenes JPEG, PNG, WEBP o AVIF.', 400, 'INVALID_FILE_TYPE');
    }

    if (file.buffer.length > MAX_FILE_SIZE) {
      throw new UploadError('El archivo no debe superar 5MB.', 413, 'FILE_TOO_LARGE');
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

    safeUploadLog('info', 'Intentando subir archivo.', {
      filename: file.filename,
      contentType: file.contentType,
      size: file.buffer.length,
      scope,
      folder,
    });

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
    const { statusCode, body } = errorResponse(error);
    safeUploadLog(statusCode >= 500 ? 'error' : 'warn', 'Upload rechazado.', {
      statusCode,
      code: body.code,
      errorName: error.name,
      errorCode: error.code,
      message: error.message,
    });
    return res.status(statusCode).json(body);
  }
}
