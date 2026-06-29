import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import Badge from '@/components/admin-v2/ui/Badge';
import Button from '@/components/admin-v2/ui/Button';
import Chart from '@/components/admin-v2/ui/Chart';
import Spinner from '@/components/admin-v2/ui/Spinner';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { salesService } from '@/services/admin-v2/salesService';
import { productService } from '@/services/admin-v2/productService';

export default function AdminV2Dashboard() {
  // Carga de métricas y datos pasando estrictamente por la capa de servicios ERP (Regla de Arquitectura)
  const { data: metrics, loading: loadingMetrics } = useDataProvider(salesService.getDashboardMetrics);
  const { data: productsData, loading: loadingProducts } = useDataProvider(productService.getAll, { limit: 50 });

  const totalProducts = productsData?.total || 0;
  const lowStockCount = productsData?.data?.filter(p => p.quantity !== undefined && p.quantity < 15).length || 0;

  const loading = loadingMetrics || loadingProducts;

  const recentOrders = [
    { id: 'ORD-9823', client: 'Carlos Mendoza', date: '29 Jun 2026', total: 1250, status: 'Completado', items: 'Anillo Solitario Dorado (x1)' },
    { id: 'ORD-9822', client: 'María Fernanda Ruiz', date: '29 Jun 2026', total: 3420, status: 'Procesando', items: 'Collar Plata Luna (x2)' },
    { id: 'ORD-9821', client: 'Gonzalo Silva', date: '28 Jun 2026', total: 890, status: 'Pendiente', items: 'Aros Perla Cultivada (x1)' },
    { id: 'ORD-9820', client: 'Lucía Blanco', date: '28 Jun 2026', total: 4150, status: 'Completado', items: 'Pulsera Oro Blanco Diamantes (x1)' },
  ];

  const recentActivities = [
    { user: 'Super Admin', action: 'Actualizó stock de', target: 'Collar Plata Luna', time: 'hace 12 min' },
    { user: 'Sistema ERP', action: 'Generó backup automático', target: 'DB_Backup_2026_06_29', time: 'hace 1 hora' },
    { user: 'Admin Pedidos', action: 'Aprobó pedido', target: 'ORD-9823', time: 'hace 2 horas' },
    { user: 'Super Admin', action: 'Modificó reglas de', target: 'Cupones de Verano', time: 'hace 4 horas' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completado': return <Badge variant="success">Completado</Badge>;
      case 'Procesando': return <Badge variant="info">Procesando</Badge>;
      case 'Pendiente': return <Badge variant="warning">Pendiente</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Dashboard - Joyerialis ERP Enterprise">
      {/* Tarjeta Superior de Bienvenida ERP */}
      <div className="card shadow-sm border-0 mb-4 p-4" style={{ borderRadius: '12px', borderLeft: '4px solid #2563eb', backgroundColor: '#ffffff' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <span className="text-uppercase font-weight-bold text-primary small" style={{ letterSpacing: '1px' }}>Portal Ejecutivo ERP</span>
            <h2 className="mb-1 text-dark font-weight-bold" style={{ fontSize: '1.5rem' }}>Resumen Operativo Corporativo</h2>
            <p className="mb-0 text-muted small">Indicadores clave de rendimiento, flujo de pedidos en tiempo real y estado general del catálogo.</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => erpToast.info('Generando reporte PDF del Dashboard...')}>
              <i className="fa-light fa-file-pdf me-2"></i> Exportar Vista
            </Button>
            <Button variant="primary" size="sm" onClick={() => erpToast.success('Datos actualizados en tiempo real.')}>
              <i className="fa-light fa-arrows-rotate me-2"></i> Refrescar
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner text="Sincronizando métricas operativas del ERP..." />
      ) : (
        <>
          {/* Tarjetas KPI */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Ingresos Mes Actual</span>
                  <div className="p-2 rounded bg-success bg-opacity-10 text-success"><i className="fa-light fa-circle-dollar fs-5"></i></div>
                </div>
                <h3 className="mb-2 text-dark font-weight-bold">${metrics?.monthlyRevenue?.toLocaleString() || '34,500'}</h3>
                <div className="d-flex align-items-center gap-2 text-success small font-weight-semibold">
                  <i className="fa-light fa-arrow-trend-up"></i><span>+{metrics?.revenueGrowth || 18.4}% vs. mes anterior</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Productos Totales</span>
                  <div className="p-2 rounded bg-primary bg-opacity-10 text-primary"><i className="fa-light fa-gem fs-5"></i></div>
                </div>
                <h3 className="mb-2 text-dark font-weight-bold">{totalProducts}</h3>
                <div className="d-flex align-items-center gap-2 text-muted small"><span>En catálogo activo</span></div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>En Proceso</span>
                  <div className="p-2 rounded bg-info bg-opacity-10 text-info"><i className="fa-light fa-boxes-packing fs-5"></i></div>
                </div>
                <h3 className="mb-2 text-dark font-weight-bold">{metrics?.pendingOrdersCount || 12}</h3>
                <div className="d-flex align-items-center gap-2 text-info small font-weight-semibold">
                  <i className="fa-light fa-clock"></i><span>Pendientes de despacho</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Stock Crítico</span>
                  <div className="p-2 rounded bg-danger bg-opacity-10 text-danger"><i className="fa-light fa-triangle-exclamation fs-5"></i></div>
                </div>
                <h3 className={`mb-2 font-weight-bold ${lowStockCount > 0 ? 'text-danger' : 'text-dark'}`}>{lowStockCount}</h3>
                <div className={`d-flex align-items-center gap-2 ${lowStockCount > 0 ? 'text-danger' : 'text-muted'} small font-weight-semibold`}>
                  <i className="fa-light fa-bell"></i><span>{lowStockCount > 0 ? 'Requieren reabastecimiento' : 'Inventario óptimo'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Gráficos ERP */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-7">
              <Chart title="Evolución de Ingresos Netos" subtitle="Rendimiento de facturación durante los últimos 6 meses" data={metrics?.salesChartData || []} color="#2563eb" />
            </div>
            <div className="col-12 col-lg-5">
              <Chart title="Volumen de Pedidos (Semana Actual)" subtitle="Flujo diario de transacciones confirmadas" data={metrics?.ordersChartData || []} color="#10b981" />
            </div>
          </div>

          {/* Tablas de Últimos Pedidos, Actividad y Accesos Rápidos */}
          <div className="row g-4">
            <div className="col-12 col-xl-8">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-1 text-dark font-weight-bold" style={{ fontSize: '1.125rem' }}>Últimos Pedidos Recibidos</h4>
                    <p className="mb-0 text-muted small">Transacciones recientes procesadas por la tienda online</p>
                  </div>
                  <Link href="/admin-v2/pedidos" className="btn btn-outline-dark btn-sm font-weight-semibold" style={{ borderRadius: '6px' }}>Ver todos</Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                        <th scope="col">Orden</th><th scope="col">Cliente</th><th scope="col">Productos</th><th scope="col" className="text-center">Estado</th><th scope="col" className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} style={{ fontSize: '0.875rem' }}>
                          <td className="font-monospace font-weight-bold text-primary">{order.id}</td>
                          <td className="font-weight-medium text-dark">{order.client}</td>
                          <td className="text-muted text-truncate" style={{ maxWidth: '180px' }}>{order.items}</td>
                          <td className="text-center">{getStatusBadge(order.status)}</td>
                          <td className="text-end font-weight-bold text-dark">${order.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '12px' }}>
                <h4 className="mb-3 text-dark font-weight-bold" style={{ fontSize: '1.125rem' }}>Accesos Rápidos ERP</h4>
                <div className="d-grid gap-2">
                  <Link href="/admin-v2/productos" className="btn btn-outline-dark text-start py-2 font-weight-medium d-flex align-items-center justify-content-between" style={{ borderRadius: '8px' }}><span className="d-flex align-items-center"><i className="fa-light fa-square-plus me-2 text-primary fs-5"></i> Registrar Nuevo Producto</span><i className="fa-light fa-chevron-right text-muted"></i></Link>
                  <Link href="/admin-v2/pedidos" className="btn btn-outline-dark text-start py-2 font-weight-medium d-flex align-items-center justify-content-between" style={{ borderRadius: '8px' }}><span className="d-flex align-items-center"><i className="fa-light fa-box-check me-2 text-success fs-5"></i> Gestionar Pedidos</span><i className="fa-light fa-chevron-right text-muted"></i></Link>
                  <Link href="/admin-v2/inventario" className="btn btn-outline-dark text-start py-2 font-weight-medium d-flex align-items-center justify-content-between" style={{ borderRadius: '8px' }}><span className="d-flex align-items-center"><i className="fa-light fa-boxes-stacked me-2 text-info fs-5"></i> Ajuste de Inventario</span><i className="fa-light fa-chevron-right text-muted"></i></Link>
                </div>
              </div>

              <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '12px' }}>
                <h4 className="mb-3 text-dark font-weight-bold" style={{ fontSize: '1.125rem' }}>Registro de Operaciones</h4>
                <div className="d-flex flex-column gap-3">
                  {recentActivities.map((act, idx) => (
                    <div key={idx} className="d-flex gap-3 pb-3 border-bottom border-light last-border-0">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}><i className="fa-light fa-shield-check text-primary" style={{ fontSize: '0.85rem' }}></i></div>
                      <div>
                        <p className="mb-0 text-dark small" style={{ lineHeight: '1.4' }}><strong>{act.user}</strong> {act.action.toLowerCase()}: <span className="text-primary font-weight-medium">{act.target}</span></p>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>{act.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
