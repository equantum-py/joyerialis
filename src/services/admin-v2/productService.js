export const productService = {
  async getAll({ search = '', category = '', status = '', sortBy = 'title', sortDir = 'asc', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, category, status, sortBy, sortDir, page, limit });
    const res = await fetch(`/api/admin-v2/products?${params}`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return await res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/products?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return await res.json();
  },

  async create(productData) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return await res.json();
  },

  async update(id, productData) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...productData }),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return await res.json();
  },

  async bulkUpdateStatus(ids, status) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bulkUpdateStatus', ids, status }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado masivo');
    return await res.json();
  },

  async bulkDelete(ids) {
    const res = await fetch('/api/admin-v2/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bulkDelete', ids }),
    });
    if (!res.ok) throw new Error('Error al eliminar masivo');
    return await res.json();
  }
};
