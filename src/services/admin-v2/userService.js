export const userService = {
  async getAll({ search = '', role = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, role, page, limit });
    const res = await fetch(`/api/admin-v2/users?${params}`);
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/users?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Usuario no encontrado');
    return await res.json();
  },

  async create(data) {
    const res = await fetch('/api/admin-v2/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear usuario');
    return await res.json();
  },

  async update(id, data) {
    const res = await fetch('/api/admin-v2/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    return await res.json();
  },

  async delete(id) {
    const res = await fetch('/api/admin-v2/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
    return await res.json();
  }
};
