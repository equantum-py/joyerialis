import productsData from '@/data/joyerialis-products.json';

// Generar lista de movimientos de inventario simulada a partir del catálogo
let inventoryMovements = [
  { id: 'INV-001', type: 'IN', product: 'Anillo Solitario Dorado', sku: 'SKU-001', qty: 50, date: '2026-06-25', note: 'Recepción de proveedor', user: 'Super Admin' },
  { id: 'INV-002', type: 'OUT', product: 'Collar Plata Luna', sku: 'SKU-002', qty: 5, date: '2026-06-26', note: 'Ajuste por daño', user: 'Admin' },
  { id: 'INV-003', type: 'IN', product: 'Aros Perla Cultivada', sku: 'SKU-003', qty: 30, date: '2026-06-27', note: 'Nueva partida de taller', user: 'Super Admin' },
  { id: 'INV-004', type: 'OUT', product: 'Pulsera Oro Blanco Diamantes', sku: 'SKU-004', qty: 2, date: '2026-06-28', note: 'Venta especial directa', user: 'Editor' },
];

export const inventoryService = {
  async getMovements({ search = '', type = '', page = 1, limit = 10 } = {}) {
    let result = [...inventoryMovements];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m => m.product.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
    }

    if (type) {
      result = result.filter(m => m.type === type);
    }

    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async addMovement(data) {
    const newMovement = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      type: data.type || 'IN',
      product: data.product || 'Producto Genérico',
      sku: data.sku || `SKU-${Date.now().toString().slice(-3)}`,
      qty: Number(data.qty || 1),
      date: new Date().toISOString().split('T')[0],
      note: data.note || 'Movimiento manual de ERP',
      user: data.user || 'Super Admin',
    };
    inventoryMovements = [newMovement, ...inventoryMovements];
    return newMovement;
  },

  async getLowStockAlerts() {
    const products = productsData?.data || [];
    return products.filter(p => p.quantity !== undefined && p.quantity < 15);
  }
};
