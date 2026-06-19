import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/admin/layout/Layout';
import ProductImage from '@/components/admin/shared/ProductImage';
import productsData from '@/data/joyerialis-products.json';
import categoriesData from '@/data/joyerialis-categories.json';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading state on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const products = productsData?.data || [];
  const categories = categoriesData?.result || [];

  // Compute some dashboard statistics
  const totalProducts = products.length;
  const totalCategories = categories.length;
  
  // Find low stock products (quantity < 15)
  const lowStockProducts = products
    .filter(p => p.quantity !== undefined && p.quantity < 15)
    .slice(0, 5);

  const recentLogs = [
    { user: 'Super Admin', action: 'Actualizó producto', target: 'Anillo Solitario Dorado', time: 'hace 10 minutos' },
    { user: 'Admin', action: 'Creó nueva categoría', target: 'Aros Especiales', time: 'hace 1 hora' },
    { user: 'Super Admin', action: 'Modificó banners de Home', target: 'Banner Principal', time: 'hace 3 horas' },
    { user: 'Editor', action: 'Actualizó stock', target: 'Collar Plata Luna', time: 'hace 5 horas' },
  ];

  return (
    <Layout>
      <Head>
        <title>Dashboard - Joyerialis Admin</title>
      </Head>

      {/* Welcome banner (Shopify-like premium layout with white background and gold badge) */}
      <div className="card shadow-sm border-0 mb-4 p-4" style={{ borderRadius: '8px', borderLeft: '4px solid #d4af37', backgroundColor: '#fff' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h4 className="mb-1 text-dark font-weight-bold">¡Bienvenido de nuevo, Super Admin!</h4>
            <p className="mb-0 text-muted small">Aquí tienes un resumen de la actividad comercial y catálogo de tu tienda Joyerialis.</p>
          </div>
          <span className="badge text-dark py-2 px-3 font-weight-semibold" style={{ backgroundColor: '#fef3c7', borderRadius: '20px', border: '1px solid #fde68a' }}>
            <i className="fa-light fa-sparkles text-warning me-1"></i> Joyería Activa
          </span>
        </div>
      </div>

      {loading ? (
        // Loading spinner
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted small">Cargando métricas y actividad reciente...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards Row (Shopify Style: clean white background, clear typography) */}
          <div className="row g-4 mb-4">
            {/* KPI 1: Products */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Productos Totales</span>
                  <div className="p-2 rounded text-dark" style={{ backgroundColor: '#f8fafc' }}>
                    <i className="fa-light fa-gem fs-5 text-warning"></i>
                  </div>
                </div>
                <h2 className="mb-1 text-dark font-weight-bold" style={{ fontSize: '2rem' }}>{totalProducts}</h2>
                <span className="text-success small font-weight-semibold">
                  <i className="fa-light fa-arrow-trend-up me-1"></i> +4 este mes
                </span>
              </div>
            </div>

            {/* KPI 2: Categories */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Categorías</span>
                  <div className="p-2 rounded text-dark" style={{ backgroundColor: '#f8fafc' }}>
                    <i className="fa-light fa-tags fs-5 text-info"></i>
                  </div>
                </div>
                <h2 className="mb-1 text-dark font-weight-bold" style={{ fontSize: '2rem' }}>{totalCategories}</h2>
                <span className="text-muted small">Estructura del catálogo</span>
              </div>
            </div>

            {/* KPI 3: Low Stock Alerts */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Stock Bajo</span>
                  <div className="p-2 rounded text-dark" style={{ backgroundColor: '#f8fafc' }}>
                    <i className="fa-light fa-triangle-exclamation fs-5 text-danger"></i>
                  </div>
                </div>
                <h2 className={`mb-1 font-weight-bold ${lowStockProducts.length > 0 ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '2rem' }}>
                  {lowStockProducts.length}
                </h2>
                <span className={`${lowStockProducts.length > 0 ? 'text-danger' : 'text-muted'} small font-weight-semibold`}>
                  {lowStockProducts.length > 0 ? 'Requieren atención' : 'Inventario al día'}
                </span>
              </div>
            </div>

            {/* KPI 4: Users */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Administradores</span>
                  <div className="p-2 rounded text-dark" style={{ backgroundColor: '#f8fafc' }}>
                    <i className="fa-light fa-users-gear fs-5 text-primary"></i>
                  </div>
                </div>
                <h2 className="mb-1 text-dark font-weight-bold" style={{ fontSize: '2rem' }}>3</h2>
                <span className="text-muted small">Cuentas activas</span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left column: Low stock alert table */}
            <div className="col-12 col-xl-8">
              <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 text-dark font-weight-bold">Alertas de Stock Bajo</h5>
                  <Link href="/admin/productos" className="btn btn-outline-dark btn-sm rounded-pill font-weight-semibold">
                    Ver todos
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr style={{ fontSize: '0.8rem' }}>
                        <th scope="col">Producto</th>
                        <th scope="col">SKU</th>
                        <th scope="col" className="text-end">Precio</th>
                        <th scope="col" className="text-center">Stock</th>
                        <th scope="col" className="text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product, idx) => (
                        <tr key={product.id || idx} style={{ fontSize: '0.875rem' }}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {/* Reusable ProductImage component with fallback logic */}
                              <ProductImage src={product.img} title={product.title} size="sm" />
                              <span className="font-weight-medium text-dark text-truncate" style={{ maxWidth: '180px' }}>{product.title}</span>
                            </div>
                          </td>
                          <td className="text-muted font-monospace">{product.sku || `PROD-${product._id}`}</td>
                          <td className="text-end font-weight-semibold">${product.price?.toLocaleString()}</td>
                          <td className="text-center">
                            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2">
                              {product.quantity} unidades
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Activo</span>
                          </td>
                        </tr>
                      ))}
                      {lowStockProducts.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            <div className="py-4">
                              <i className="fa-light fa-circle-check fs-2 text-success mb-2 d-block"></i>
                              <span className="font-weight-medium d-block text-dark mb-1">Todo al día</span>
                              <span>No hay productos con stock crítico en el inventario.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right column: Recent activity log & quick actions */}
            <div className="col-12 col-xl-4">
              <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 className="mb-3 text-dark font-weight-bold">Acciones Rápidas</h5>
                <div className="d-grid gap-2">
                  <Link href="/admin/productos" className="btn btn-outline-dark text-start py-2 font-weight-medium d-flex align-items-center justify-content-between" style={{ borderRadius: '8px' }}>
                    <span><i className="fa-light fa-plus-circle me-2"></i> Crear Producto</span>
                    <i className="fa-light fa-chevron-right text-muted"></i>
                  </Link>
                  <Link href="/admin/categorias" className="btn btn-outline-dark text-start py-2 font-weight-medium d-flex align-items-center justify-content-between" style={{ borderRadius: '8px' }}>
                    <span><i className="fa-light fa-folder-plus me-2"></i> Crear Categoría</span>
                    <i className="fa-light fa-chevron-right text-muted"></i>
                  </Link>
                  <Link href="/admin/configuracion" className="btn btn-outline-dark text-start py-2 font-weight-medium d-flex align-items-center justify-content-between" style={{ borderRadius: '8px' }}>
                    <span><i className="fa-light fa-sliders me-2"></i> Ajustes de Tienda</span>
                    <i className="fa-light fa-chevron-right text-muted"></i>
                  </Link>
                </div>
              </div>

              <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 className="mb-3 text-dark font-weight-bold">Actividad Reciente</h5>
                <div className="d-flex flex-column gap-3">
                  {recentLogs.map((log, idx) => (
                    <div key={idx} className="d-flex gap-3 pb-3 border-bottom border-light last-border-0">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                        <i className="fa-light fa-user-pen text-secondary" style={{ fontSize: '0.85rem' }}></i>
                      </div>
                      <div>
                        <p className="mb-0 text-dark small" style={{ lineHeight: '1.4' }}>
                          <strong>{log.user}</strong> {log.action.toLowerCase()}: <span className="text-secondary">{log.target}</span>
                        </p>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>{log.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
