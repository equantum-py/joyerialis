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

export const productService = {
  async getAll({ search = '', category = '', status = '', sortBy = 'title', sortDir = 'asc', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, category, status, sortBy, sortDir, page, limit });
    const res = await fetch(`/api/admin-v2/products?${params}`);
    return parseResponse(res, 'Error al obtener productos');
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/products?id=${encodeURIComponent(id)}`);
    return parseResponse(res, 'Producto no encontrado');
  },

  async create(productData) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return parseResponse(res, 'Error al crear producto');
  },

  async update(id, productData) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...productData }),
    });
    return parseResponse(res, 'Error al actualizar producto');
  },

  async delete(id) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return parseResponse(res, 'Error al eliminar producto');
  },

  async bulkUpdateStatus(ids, status) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bulkUpdateStatus', ids, status }),
    });
    return parseResponse(res, 'Error al actualizar estado masivo');
  },

  async bulkDelete(ids) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bulkDelete', ids }),
    });
    return parseResponse(res, 'Error al eliminar masivo');
  },
};
