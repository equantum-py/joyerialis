export const categoryService = {
  async getAll({ search = '', sortBy = 'name', sortDir = 'asc' } = {}) {
    const params = new URLSearchParams({ search, sortBy, sortDir });
    const res = await fetch(`/api/admin-v2/categories?${params}`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return await res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/categories?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Categoría no encontrada');
    return await res.json();
  },

  async create(data) {
    const res = await fetch('/api/admin-v2/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return await res.json();
  },

  async update(id, data) {
    const res = await fetch('/api/admin-v2/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Error al actualizar categoría');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch('/api/admin-v2/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Error al eliminar categoría');
    return await res.json();
  }
};
