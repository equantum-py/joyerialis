export const inventoryService = {
  async getMovements({ search = '', type = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, type, page, limit });
    const res = await fetch(`/api/admin-v2/inventory?${params}`);
    if (!res.ok) throw new Error('Error al obtener movimientos de inventario');
    return await res.json();
  },

  async addMovement(data) {
    const res = await fetch('/api/admin-v2/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar movimiento');
    return await res.json();
  },

  async getLowStockAlerts() {
    const res = await fetch('/api/admin-v2/inventory?action=getLowStockAlerts');
    if (!res.ok) throw new Error('Error al obtener alertas de stock');
    return await res.json();
  }
};
