import React from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import Chart from '@/components/admin-v2/ui/Chart';
import Spinner from '@/components/admin-v2/ui/Spinner';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { salesService } from '@/services/admin-v2/salesService';

export default function AdminV2Sales() {
  const { data, loading } = useDataProvider(salesService.getDashboardMetrics);

  return (
    <AdminLayout title="Dashboard de Ventas - Joyerialis ERP">
      <CRUDManager title="Dashboard Inteligente de Ventas" subtitle="Análisis avanzado de KPIs, comparativas de facturación e indicadores de rendimiento comercial">
        {loading ? (
          <Spinner text="Cargando métricas de ventas y comparativas..." />
        ) : (
          <div className="p-4 bg-light d-flex flex-column gap-4">
            {/* Tarjetas KPI */}
            <div className="row g-4">
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '12px' }}>
                  <span className="text-muted small font-weight-bold text-uppercase mb-2">Ingresos del Mes</span>
                  <h2 className="text-dark font-weight-bold mb-1">${data.monthlyRevenue?.toLocaleString()}</h2>
                  <span className="text-success small font-weight-semibold"><i className="fa-light fa-arrow-trend-up me-1"></i> +{data.revenueGrowth}% vs mes anterior</span>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '12px' }}>
                  <span className="text-muted small font-weight-bold text-uppercase mb-2">Ticket Promedio</span>
                  <h2 className="text-dark font-weight-bold mb-1">${data.averageOrderValue?.toLocaleString()}</h2>
                  <span className="text-muted small">Valor medio por pedido</span>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '12px' }}>
                  <span className="text-muted small font-weight-bold text-uppercase mb-2">Tasa de Conversión</span>
                  <h2 className="text-dark font-weight-bold mb-1">{data.conversionRate}%</h2>
                  <span className="text-success small font-weight-semibold"><i className="fa-light fa-circle-check me-1"></i> Excelente rendimiento</span>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '12px' }}>
                  <span className="text-muted small font-weight-bold text-uppercase mb-2">Pedidos Pendientes</span>
                  <h2 className="text-info font-weight-bold mb-1">{data.pendingOrdersCount}</h2>
                  <span className="text-info small font-weight-semibold">Listos para despachar</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="row g-4">
              <div className="col-12 col-xl-8">
                <Chart title="Evolución de Ingresos Mensuales" subtitle="Comparativa de facturación bruta durante el último semestre" data={data.salesChartData || []} color="#2563eb" height="280px" />
              </div>
              <div className="col-12 col-xl-4">
                <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '12px' }}>
                  <h4 className="font-weight-bold text-dark mb-4">Top Productos Estrella</h4>
                  <div className="d-flex flex-column gap-3">
                    {data.topProducts?.map((p, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between pb-3 border-bottom border-light last-border-0">
                        <div>
                          <h6 className="font-weight-bold text-dark mb-1 small">{p.title}</h6>
                          <span className="text-muted small">{p.units} unidades vendidas</span>
                        </div>
                        <strong className="text-primary font-weight-bold">${p.revenue.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CRUDManager>
    </AdminLayout>
  );
}
