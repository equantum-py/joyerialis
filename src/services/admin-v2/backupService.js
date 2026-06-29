export const backupService = {
  async getAll({ page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ page, limit });
    const res = await fetch(`/api/admin-v2/backups?${params}`);
    if (!res.ok) throw new Error('Error al obtener respaldos');
    return await res.json();
  },

  async createBackup(type = 'Manual') {
    const res = await fetch('/api/admin-v2/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error('Error al crear respaldo');
    return await res.json();
  },

  async deleteBackup(id) {
    const res = await fetch('/api/admin-v2/backups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Error al eliminar respaldo');
    return await res.json();
  }
};
