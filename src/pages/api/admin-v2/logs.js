import { prisma } from '@/lib/prisma';

const defaultLogs = [
  { id: 'LOG-001', user: 'Super Admin', action: 'Actualizó stock de', target: 'Collar Plata Luna', time: '2026-06-29 12:15', ip: '192.168.1.10', module: 'Inventario' },
  { id: 'LOG-002', user: 'Sistema ERP', action: 'Generó backup automático', target: 'DB_Backup_2026_06_29', time: '2026-06-29 11:00', ip: '127.0.0.1', module: 'Backups' },
  { id: 'LOG-003', user: 'Admin Pedidos', action: 'Aprobó pedido', target: 'ORD-9823', time: '2026-06-29 10:20', ip: '192.168.1.15', module: 'Pedidos' },
  { id: 'LOG-004', user: 'Super Admin', action: 'Modificó reglas de', target: 'Cupones de Verano', time: '2026-06-29 09:10', ip: '192.168.1.10', module: 'Cupones' },
  { id: 'LOG-005', user: 'Editor Catálogo', action: 'Creó nuevo producto', target: 'Aros Plata Diamante', time: '2026-06-28 17:30', ip: '192.168.1.22', module: 'Productos' },
];

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { search = '', module = '', page = 1, limit = 10 } = req.query;
      let items = [];

      try {
        const dbLogs = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' } });
        items = dbLogs.map(l => ({
          id: l.id,
          user: l.userName || 'Super Admin',
          action: l.action,
          target: l.target || l.details || 'General',
          time: l.createdAt.toISOString().replace('T', ' ').slice(0, 16),
          ip: l.ip || '192.168.1.10',
          module: l.module || 'General'
        }));
      } catch (e) {}

      if (!items || items.length === 0) {
        items = [...defaultLogs];
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(l => l.user?.toLowerCase().includes(q) || l.target?.toLowerCase().includes(q));
      }

      if (module) {
        items = items.filter(l => l.module === module);
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
      const { user = 'Super Admin', action, target, module } = req.body;
      try {
        const newLog = await prisma.activityLog.create({
          data: {
            action,
            details: target,
            userName: user,
            target,
            ip: '192.168.1.10',
            module
          }
        });
        return res.status(201).json({
          id: newLog.id,
          user: newLog.userName || user,
          action: newLog.action,
          target: newLog.target || target,
          time: newLog.createdAt.toISOString().replace('T', ' ').slice(0, 16),
          ip: newLog.ip || '192.168.1.10',
          module: newLog.module || module
        });
      } catch (e) {
        const newLog = {
          id: `LOG-${Date.now().toString().slice(-3)}`,
          user,
          action,
          target,
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          ip: '192.168.1.10',
          module,
        };
        return res.status(201).json(newLog);
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
