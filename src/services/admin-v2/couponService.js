export const couponService = {
  async getAll({ search = '', status = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, status, page, limit });
    const res = await fetch(`/api/admin-v2/coupons?${params}`);
    if (!res.ok) throw new Error('Error al obtener cupones');
    return await res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/coupons?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Cupón no encontrado');
    return await res.json();
  },

  async create(data) {
    const res = await fetch('/api/admin-v2/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear cupón');
    return await res.json();
  },

  async update(id, data) {
    const res = await fetch('/api/admin-v2/coupons', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Error al actualizar cupón');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch('/api/admin-v2/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Error al eliminar cupón');
    return await res.json();
  }
};
