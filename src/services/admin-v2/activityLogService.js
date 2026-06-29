export const activityLogService = {
  async getAll({ search = '', module = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ search, module, page, limit });
    const res = await fetch(`/api/admin-v2/logs?${params}`);
    if (!res.ok) throw new Error('Error al obtener registro de actividades');
    return await res.json();
  },

  async logAction({ user, action, target, module }) {
    const res = await fetch('/api/admin-v2/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, action, target, module }),
    });
    if (!res.ok) throw new Error('Error al registrar actividad');
    return await res.json();
  }
};
