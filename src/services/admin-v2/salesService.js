export const salesService = {
  async getDashboardMetrics() {
    const res = await fetch('/api/admin-v2/sales');
    if (!res.ok) throw new Error('Error al obtener métricas del dashboard');
    return await res.json();
  }
};
