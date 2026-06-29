export const customerService = {
  async getAll({ search = '', status = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, status, page, limit });
    const res = await fetch(`/api/admin-v2/customers?${params}`);
    if (!res.ok) throw new Error('Error al obtener clientes');
    return await res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/customers?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Cliente no encontrado');
    return await res.json();
  },

  async create(data) {
    const res = await fetch('/api/admin-v2/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear cliente');
    return await res.json();
  },

  async update(id, data) {
    const res = await fetch('/api/admin-v2/customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Error al actualizar cliente');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch('/api/admin-v2/customers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Error al eliminar cliente');
    return await res.json();
  }
};
