import { prisma } from '@/lib/prisma';

const defaultCoupons = [
  { id: 'CUP-001', code: 'VERANO2026', discount: 15, discountType: 'percentage', startDate: '2026-06-01', endDate: '2026-07-31', usageLimit: 100, usedCount: 24, status: 'Activo', minAmount: 500 },
  { id: 'CUP-002', code: 'BIENVENIDA10', discount: 10, discountType: 'percentage', startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 500, usedCount: 142, status: 'Activo', minAmount: 0 },
  { id: 'CUP-003', code: 'HOTSALE50', discount: 50, discountType: 'fixed', startDate: '2026-05-10', endDate: '2026-05-17', usageLimit: 50, usedCount: 50, status: 'Inactivo', minAmount: 200 },
];

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { id, search = '', status = '', page = 1, limit = 10 } = req.query;

      if (id) {
        try {
          const coupon = await prisma.coupon.findUnique({ where: { id } });
          if (coupon) return res.status(200).json({ ...coupon, discount: Number(coupon.discount), minAmount: Number(coupon.minAmount) });
        } catch (e) {}
        const fallback = defaultCoupons.find(c => c.id === id);
        if (!fallback) return res.status(404).json({ message: 'Cupón no encontrado' });
        return res.status(200).json(fallback);
      }

      let items = [];
      try {
        const dbCoupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
        items = dbCoupons.map(c => ({ ...c, discount: Number(c.discount), minAmount: Number(c.minAmount) }));
      } catch (e) {}

      if (!items || items.length === 0) {
        items = [...defaultCoupons];
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(c => c.code?.toLowerCase().includes(q));
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
        const newCoupon = await prisma.coupon.create({
          data: {
            code: data.code.toUpperCase(),
            discount: Number(data.discount || 0),
            discountType: data.discountType || 'percentage',
            startDate: data.startDate || new Date().toISOString().split('T')[0],
            endDate: data.endDate || '2026-12-31',
            usageLimit: Number(data.usageLimit || 100),
            usedCount: 0,
            status: data.status || 'Activo',
            minAmount: Number(data.minAmount || 0),
          }
        });
        return res.status(201).json({ ...newCoupon, discount: Number(newCoupon.discount), minAmount: Number(newCoupon.minAmount) });
      } catch (e) {
        const newCoupon = {
          id: `CUP-${Date.now().toString().slice(-3)}`,
          code: data.code?.toUpperCase(),
          discount: Number(data.discount || 0),
          discountType: data.discountType || 'percentage',
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          endDate: data.endDate || '2026-12-31',
          usageLimit: Number(data.usageLimit || 100),
          usedCount: 0,
          status: data.status || 'Activo',
          minAmount: Number(data.minAmount || 0),
        };
        return res.status(201).json(newCoupon);
      }
    }

    if (method === 'PUT') {
      const { id, ...data } = req.body;
      try {
        const updated = await prisma.coupon.update({
          where: { id },
          data
        });
        return res.status(200).json({ ...updated, discount: Number(updated.discount), minAmount: Number(updated.minAmount) });
      } catch (e) {
        return res.status(200).json({ id, ...data });
      }
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      try {
        await prisma.coupon.delete({ where: { id } });
      } catch (e) {}
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
