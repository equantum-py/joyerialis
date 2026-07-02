const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const DEFAULT_MAX_SIZE_MB = 5;

async function parseResponse(res, fallbackMessage) {
  let payload = null;
  try {
    payload = await res.json();
  } catch (error) {
    payload = null;
  }

  if (!res.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }

  return payload;
}

export const mediaService = {
  async upload(file, options = {}) {
    const {
      scope = 'general',
      folder = 'general',
      alt = '',
      metadata = {},
      allowedTypes = DEFAULT_ALLOWED_TYPES,
      maxSizeMB = DEFAULT_MAX_SIZE_MB,
    } = options;

    if (!file) throw new Error('Debe seleccionar un archivo.');
    if (!allowedTypes.includes(file.type)) throw new Error('Tipo de archivo no permitido.');
    if (file.size > maxSizeMB * 1024 * 1024) throw new Error(`El archivo no debe superar ${maxSizeMB}MB.`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('scope', scope);
    formData.append('folder', folder);
    formData.append('alt', alt);
    formData.append('metadata', JSON.stringify(metadata));

    const res = await fetch('/api/admin-v2/media/upload', {
      method: 'POST',
      body: formData,
    });

    return parseResponse(res, 'Error al subir archivo.');
  },
};
