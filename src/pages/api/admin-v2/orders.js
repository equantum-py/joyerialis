import { prisma } from '@/lib/prisma';

const defaultOrders = [
  { id: 'ORD-9823', client: 'Carlos Mendoza', email: 'carlos@mendoza.com', date: '2026-06-29', total: 1250, status: 'Completado', items: [{ title: 'Anillo Solitario Dorado', qty: 1, price: 1250 }], notes: 'Entrega prioritaria', paymentMethod: 'Tarjeta de Crédito', tracking: 'TRK-55214' },
  { id: 'ORD-9822', client: 'María Fernanda Ruiz', email: 'maria@ruiz.com', date: '2026-06-29', total: 3420, status: 'Procesando', items: [{ title: 'Collar Plata Luna', qty: 2, price: 1710 }], notes: 'Envolver para regalo', paymentMethod: 'Transferencia', tracking: 'TRK-55215' },
  { id: 'ORD-9821', client: 'Gonzalo Silva', email: 'gonzalo@silva.com', date: '2026-06-28', total: 890, status: 'Pendiente', items: [{ title: 'Aros Perla Cultivada', qty: 1, price: 890 }], notes: 'Contactar antes de entregar', paymentMethod: 'Stripe', tracking: 'TRK-55216' },
  { id: 'ORD-9820', client: 'Lucía Blanco', email: 'lucia@blanco.com', date: '2026-06-28', total: 4150, status: 'Completado', items: [{ title: 'Pulsera Oro Blanco Diamantes', qty: 1, price: 4150 }], notes: 'Ninguna', paymentMethod: 'Tarjeta de Crédito', tracking: 'TRK-55217' },
  { id: 'ORD-9819', client: 'Esteban Quito', email: 'esteban@quito.com', date: '2026-06-27', total: 640, status: 'Cancelado', items: [{ title: 'Aros Simples Plata', qty: 1, price: 640 }], notes: 'Cancelado por el cliente', paymentMethod: 'PayPal', tracking: '' },
];

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { id, search = '', status = '', page = 1, limit = 10 } = req.query;

      if (id) {
        try {
          const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
          if (order) {
            return res.status(200).json({
              id: order.id,
              client: order.customerName,
              email: order.customerEmail,
              date: order.createdAt.toISOString().split('T')[0],
              total: Number(order.total),
              status: order.status,
              notes: order.notes || '',
              paymentMethod: order.paymentMethod || 'Tarjeta de Crédito',
              tracking: order.tracking || '',
              items: order.items?.map(i => ({ title: i.productTitle, qty: i.quantity, price: Number(i.productPrice) })) || []
            });
          }
        } catch (e) {}
        const fallback = defaultOrders.find(o => o.id === id);
        if (!fallback) return res.status(404).json({ message: 'Pedido no encontrado' });
        return res.status(200).json(fallback);
      }

      let items = [];
      try {
        const dbOrders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
        items = dbOrders.map(o => ({
          id: o.id,
          client: o.customerName,
          email: o.customerEmail,
          date: o.createdAt.toISOString().split('T')[0],
          total: Number(o.total),
          status: o.status,
          notes: o.notes || '',
          paymentMethod: o.paymentMethod || 'Tarjeta de Crédito',
          tracking: o.tracking || '',
          items: o.items?.map(i => ({ title: i.productTitle, qty: i.quantity, price: Number(i.productPrice) })) || []
        }));
      } catch (e) {}

      if (!items || items.length === 0) {
        items = [...defaultOrders];
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(o => o.id?.toLowerCase().includes(q) || o.client?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q));
      }

      if (status) {
        items = items.filter(o => o.status === status);
      }

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const total = items.length;
      const totalPages = Math.ceil(total / limitNum);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedData = items.slice(startIndex, startIndex + limitNum);

      return res.status(200).json({
        data: paginatedData,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      });
    }

    if (method === 'POST') {
      const { id, action, status, note } = req.body;
      if (action === 'updateStatus') {
        try {
          const updated = await prisma.order.update({
            where: { id },
            data: { status }
          });
          return res.status(200).json(updated);
        } catch (e) {
          const found = defaultOrders.find(o => o.id === id);
          return res.status(200).json(found ? { ...found, status } : { id, status });
        }
      }
      if (action === 'addNote') {
        try {
          const existing = await prisma.order.findUnique({ where: { id } });
          const newNotes = existing?.notes ? `${existing.notes} | ${note}` : note;
          const updated = await prisma.order.update({
            where: { id },
            data: { notes: newNotes }
          });
          return res.status(200).json(updated);
        } catch (e) {
          const found = defaultOrders.find(o => o.id === id);
          const newNotes = found?.notes ? `${found.notes} | ${note}` : note;
          return res.status(200).json(found ? { ...found, notes: newNotes } : { id, notes: note });
        }
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
