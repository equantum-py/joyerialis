import { prisma } from '@/lib/prisma';

const defaultCustomers = [
  { id: 'CUST-001', name: 'Carlos Mendoza', email: 'carlos@mendoza.com', phone: '+54 9 11 5521-9823', ordersCount: 4, totalSpent: 5120, status: 'Activo', address: 'Av. Libertador 1240, Buenos Aires', registered: '2025-03-12' },
  { id: 'CUST-002', name: 'María Fernanda Ruiz', email: 'maria@ruiz.com', phone: '+54 9 11 4432-1122', ordersCount: 2, totalSpent: 3420, status: 'Activo', address: 'Callao 850, Buenos Aires', registered: '2025-06-15' },
  { id: 'CUST-003', name: 'Gonzalo Silva', email: 'gonzalo@silva.com', phone: '+54 9 11 3321-9988', ordersCount: 1, totalSpent: 890, status: 'Inactivo', address: 'Belgrano 430, Córdoba', registered: '2025-11-20' },
  { id: 'CUST-004', name: 'Lucía Blanco', email: 'lucia@blanco.com', phone: '+54 9 11 2211-7766', ordersCount: 5, totalSpent: 12450, status: 'VIP', address: 'Mendoza 1540, Rosario', registered: '2024-08-05' },
];

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { id, search = '', status = '', page = 1, limit = 10 } = req.query;

      if (id) {
        try {
          const cust = await prisma.customer.findUnique({ where: { id } });
          if (cust) return res.status(200).json({ ...cust, totalSpent: Number(cust.totalSpent) });
        } catch (e) {}
        const fallback = defaultCustomers.find(c => c.id === id);
        if (!fallback) return res.status(404).json({ message: 'Cliente no encontrado' });
        return res.status(200).json(fallback);
      }

      let items = [];
      try {
        const dbCust = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
        items = dbCust.map(c => ({ ...c, totalSpent: Number(c.totalSpent) }));
      } catch (e) {}

      if (!items || items.length === 0) {
        items = [...defaultCustomers];
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(c => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q));
      }

      if (status) {
        items = items.filter(c => c.status === status);
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
      const data = req.body;
      try {
        const newCustomer = await prisma.customer.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            ordersCount: 0,
            totalSpent: 0,
            status: data.status || 'Activo',
            address: data.address || '',
            registered: new Date().toISOString().split('T')[0],
          }
        });
        return res.status(201).json({ ...newCustomer, totalSpent: Number(newCustomer.totalSpent) });
      } catch (e) {
        const newCustomer = {
          id: `CUST-${Date.now().toString().slice(-3)}`,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          ordersCount: 0,
          totalSpent: 0,
          status: data.status || 'Activo',
          address: data.address || '',
          registered: new Date().toISOString().split('T')[0],
        };
        return res.status(201).json(newCustomer);
      }
    }

    if (method === 'PUT') {
      const { id, ...data } = req.body;
      try {
        const updated = await prisma.customer.update({
          where: { id },
          data
        });
        return res.status(200).json({ ...updated, totalSpent: Number(updated.totalSpent) });
      } catch (e) {
        return res.status(200).json({ id, ...data });
      }
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      try {
        await prisma.customer.delete({ where: { id } });
      } catch (e) {}
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
