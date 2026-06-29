let ordersCollection = [
  { id: 'ORD-9823', client: 'Carlos Mendoza', email: 'carlos@mendoza.com', date: '2026-06-29', total: 1250, status: 'Completado', items: [{ title: 'Anillo Solitario Dorado', qty: 1, price: 1250 }], notes: 'Entrega prioritaria', paymentMethod: 'Tarjeta de Crédito', tracking: 'TRK-55214' },
  { id: 'ORD-9822', client: 'María Fernanda Ruiz', email: 'maria@ruiz.com', date: '2026-06-29', total: 3420, status: 'Procesando', items: [{ title: 'Collar Plata Luna', qty: 2, price: 1710 }], notes: 'Envolver para regalo', paymentMethod: 'Transferencia', tracking: 'TRK-55215' },
  { id: 'ORD-9821', client: 'Gonzalo Silva', email: 'gonzalo@silva.com', date: '2026-06-28', total: 890, status: 'Pendiente', items: [{ title: 'Aros Perla Cultivada', qty: 1, price: 890 }], notes: 'Contactar antes de entregar', paymentMethod: 'Stripe', tracking: 'TRK-55216' },
  { id: 'ORD-9820', client: 'Lucía Blanco', email: 'lucia@blanco.com', date: '2026-06-28', total: 4150, status: 'Completado', items: [{ title: 'Pulsera Oro Blanco Diamantes', qty: 1, price: 4150 }], notes: 'Ninguna', paymentMethod: 'Tarjeta de Crédito', tracking: 'TRK-55217' },
  { id: 'ORD-9819', client: 'Esteban Quito', email: 'esteban@quito.com', date: '2026-06-27', total: 640, status: 'Cancelado', items: [{ title: 'Aros Simples Plata', qty: 1, price: 640 }], notes: 'Cancelado por el cliente', paymentMethod: 'PayPal', tracking: '' },
];

export const orderService = {
  async getAll({ search = '', status = '', page = 1, limit = 10 } = {}) {
    let result = [...ordersCollection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o => o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    }

    if (status) {
      result = result.filter(o => o.status === status);
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

  async getById(id) {
    const order = ordersCollection.find(o => o.id === id);
    if (!order) throw new Error('Pedido no encontrado');
    return { ...order };
  },

  async updateStatus(id, status) {
    const index = ordersCollection.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Pedido no encontrado');
    ordersCollection[index] = { ...ordersCollection[index], status };
    return ordersCollection[index];
  },

  async addNote(id, note) {
    const index = ordersCollection.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Pedido no encontrado');
    ordersCollection[index] = { ...ordersCollection[index], notes: `${ordersCollection[index].notes} | ${note}` };
    return ordersCollection[index];
  }
};
