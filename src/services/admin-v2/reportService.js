export const reportService = {
  async getReportData(type, dateRange) {
    const params = new URLSearchParams({ type });
    const res = await fetch(`/api/admin-v2/reports?${params}`);
    if (!res.ok) throw new Error('Error al obtener datos del reporte');
    return await res.json();
  }
};
