export const orderService = {
  async getAll({ search = '', status = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, status, page, limit });
    const res = await fetch(`/api/admin-v2/orders?${params}`);
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return await res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/admin-v2/orders?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Pedido no encontrado');
    return await res.json();
  },

  async updateStatus(id, status) {
    const res = await fetch('/api/admin-v2/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateStatus', id, status }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado del pedido');
    return await res.json();
  },

  async addNote(id, note) {
    const res = await fetch('/api/admin-v2/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addNote', id, note }),
    });
    if (!res.ok) throw new Error('Error al agregar nota al pedido');
    return await res.json();
  }
};
