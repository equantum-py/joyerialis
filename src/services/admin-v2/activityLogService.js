let logsCollection = [
  { id: 'LOG-001', user: 'Super Admin', action: 'Actualizó stock de', target: 'Collar Plata Luna', time: '2026-06-29 12:15', ip: '192.168.1.10', module: 'Inventario' },
  { id: 'LOG-002', user: 'Sistema ERP', action: 'Generó backup automático', target: 'DB_Backup_2026_06_29', time: '2026-06-29 11:00', ip: '127.0.0.1', module: 'Backups' },
  { id: 'LOG-003', user: 'Admin Pedidos', action: 'Aprobó pedido', target: 'ORD-9823', time: '2026-06-29 10:20', ip: '192.168.1.15', module: 'Pedidos' },
  { id: 'LOG-004', user: 'Super Admin', action: 'Modificó reglas de', target: 'Cupones de Verano', time: '2026-06-29 09:10', ip: '192.168.1.10', module: 'Cupones' },
  { id: 'LOG-005', user: 'Editor Catálogo', action: 'Creó nuevo producto', target: 'Aros Plata Diamante', time: '2026-06-28 17:30', ip: '192.168.1.22', module: 'Productos' },
];

export const activityLogService = {
  async getAll({ search = '', module = '', page = 1, limit = 10 } = {}) {
    let result = [...logsCollection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => l.user.toLowerCase().includes(q) || l.target.toLowerCase().includes(q));
    }

    if (module) {
      result = result.filter(l => l.module === module);
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

  async logAction({ user, action, target, module }) {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-3)}`,
      user,
      action,
      target,
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ip: '192.168.1.10',
      module,
    };
    logsCollection = [newLog, ...logsCollection];
    return newLog;
  }
};
