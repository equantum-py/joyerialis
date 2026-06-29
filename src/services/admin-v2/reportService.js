export const reportService = {
  async getReportData(type, dateRange) {
    // Genera y devuelve datos estructurados listos para exportación según el tipo de reporte
    if (type === 'ventas') {
      return [
        { fecha: '2026-06-25', orden: 'ORD-9810', cliente: 'Carlos Mendoza', total: 1250, metodo: 'Tarjeta' },
        { fecha: '2026-06-26', orden: 'ORD-9811', cliente: 'María Fernanda Ruiz', total: 3420, metodo: 'Transferencia' },
        { fecha: '2026-06-27', orden: 'ORD-9812', cliente: 'Gonzalo Silva', total: 890, metodo: 'Stripe' },
        { fecha: '2026-06-28', orden: 'ORD-9813', cliente: 'Lucía Blanco', total: 4150, metodo: 'Tarjeta' },
      ];
    }
    if (type === 'productos') {
      return [
        { sku: 'SKU-001', producto: 'Anillo Solitario Dorado', vendidos: 45, stock: 24, ingresos: 56250 },
        { sku: 'SKU-002', producto: 'Collar Plata Luna', vendidos: 38, stock: 12, ingresos: 32300 },
        { sku: 'SKU-003', producto: 'Pulsera Oro Blanco Diamantes', vendidos: 15, stock: 5, ingresos: 62250 },
      ];
    }
    if (type === 'clientes') {
      return [
        { cliente: 'Carlos Mendoza', email: 'carlos@mendoza.com', compras: 4, gastado: 5120 },
        { cliente: 'María Fernanda Ruiz', email: 'maria@ruiz.com', compras: 2, gastado: 3420 },
        { cliente: 'Lucía Blanco', email: 'lucia@blanco.com', compras: 5, gastado: 12450 },
      ];
    }
    return [];
  }
};
