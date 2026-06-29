import { prisma } from '@/lib/prisma';
import productsData from '@/data/joyerialis-products.json';

const defaultMovements = [
  { id: 'INV-001', type: 'IN', product: 'Anillo Solitario Dorado', sku: 'SKU-001', qty: 50, date: '2026-06-25', note: 'Recepción de proveedor', user: 'Super Admin' },
  { id: 'INV-002', type: 'OUT', product: 'Collar Plata Luna', sku: 'SKU-002', qty: 5, date: '2026-06-26', note: 'Ajuste por daño', user: 'Admin' },
  { id: 'INV-003', type: 'IN', product: 'Aros Perla Cultivada', sku: 'SKU-003', qty: 30, date: '2026-06-27', note: 'Nueva partida de taller', user: 'Super Admin' },
  { id: 'INV-004', type: 'OUT', product: 'Pulsera Oro Blanco Diamantes', sku: 'SKU-004', qty: 2, date: '2026-06-28', note: 'Venta especial directa', user: 'Editor' },
];

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { action, search = '', type = '', page = 1, limit = 10 } = req.query;

      if (action === 'getLowStockAlerts') {
        let items = [];
        try {
          items = await prisma.product.findMany({ where: { quantity: { lt: 15 } } });
        } catch (e) {}
        if (!items || items.length === 0) {
          items = (productsData?.data || []).filter(p => p.quantity !== undefined && p.quantity < 15);
        }
        return res.status(200).json(items);
      }

      let items = [];
      try {
        items = await prisma.inventoryMovement.findMany({
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {}

      if (!items || items.length === 0) {
        items = [...defaultMovements];
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(m => m.product?.toLowerCase().includes(q) || m.sku?.toLowerCase().includes(q) || m.id?.toLowerCase().includes(q));
      }

      if (type) {
        items = items.filter(m => m.type === type);
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
        const newMovement = await prisma.inventoryMovement.create({
          data: {
            type: data.type || 'IN',
            product: data.product || 'Producto Genérico',
            sku: data.sku || `SKU-${Date.now().toString().slice(-3)}`,
            qty: Number(data.qty || 1),
            date: new Date().toISOString().split('T')[0],
            note: data.note || 'Movimiento manual de ERP',
            user: data.user || 'Super Admin',
          }
        });
        return res.status(201).json(newMovement);
      } catch (e) {
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
        return res.status(201).json(newMovement);
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
