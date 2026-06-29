let backupsCollection = [
  { id: 'BCK-001', name: 'DB_Backup_2026_06_29.sql.gz', size: '14.2 MB', date: '2026-06-29 11:00', type: 'Automático', status: 'Completado' },
  { id: 'BCK-002', name: 'DB_Backup_2026_06_28.sql.gz', size: '14.1 MB', date: '2026-06-28 11:00', type: 'Automático', status: 'Completado' },
  { id: 'BCK-003', name: 'MANUAL_Backup_2026_06_25.sql.gz', size: '13.8 MB', date: '2026-06-25 18:30', type: 'Manual', status: 'Completado' },
];

export const backupService = {
  async getAll({ page = 1, limit = 10 } = {}) {
    const total = backupsCollection.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = backupsCollection.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async createBackup(type = 'Manual') {
    const newBck = {
      id: `BCK-${Date.now().toString().slice(-3)}`,
      name: `${type.toUpperCase()}_Backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}.sql.gz`,
      size: '14.3 MB',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type,
      status: 'Completado'
    };
    backupsCollection = [newBck, ...backupsCollection];
    return newBck;
  },

  async deleteBackup(id) {
    backupsCollection = backupsCollection.filter(b => b.id !== id);
    return { success: true };
  }
};
