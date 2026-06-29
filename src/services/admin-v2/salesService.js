export const salesService = {
  async getDashboardMetrics() {
    return {
      monthlyRevenue: 34500,
      revenueGrowth: 18.4,
      pendingOrdersCount: 12,
      averageOrderValue: 1450,
      conversionRate: 3.2,
      salesChartData: [
        { label: 'Ene', value: 12500 },
        { label: 'Feb', value: 18200 },
        { label: 'Mar', value: 15400 },
        { label: 'Abr', value: 22100 },
        { label: 'May', value: 28900 },
        { label: 'Jun', value: 34500 },
      ],
      ordersChartData: [
        { label: 'Lun', value: 12 },
        { label: 'Mar', value: 19 },
        { label: 'Mie', value: 15 },
        { label: 'Jue', value: 25 },
        { label: 'Vie', value: 32 },
        { label: 'Sab', value: 40 },
        { label: 'Dom', value: 28 },
      ],
      topProducts: [
        { title: 'Anillo Solitario Dorado', units: 45, revenue: 56250 },
        { title: 'Collar Plata Luna', units: 38, revenue: 32300 },
        { title: 'Pulsera Oro Blanco Diamantes', units: 15, revenue: 62250 },
      ]
    };
  }
};
