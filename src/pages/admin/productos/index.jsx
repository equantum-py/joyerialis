import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/admin/layout/Layout';
import productsData from '@/data/joyerialis-products.json';
import styles from '@/components/admin/layout/admin.module.css';

export default function Productos() {
  const products = productsData?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Get unique categories from products for filtering
  const categories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)));

  // Simulate loading state on search/filter change to look professional
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  // Filter products based on search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category?.name === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Head>
        <title>Productos - Joyerialis Admin</title>
      </Head>

      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="mb-1 text-dark font-weight-bold">Productos</h4>
          <p className="mb-0 text-muted small">Gestiona el catálogo de productos, inventario y especificaciones.</p>
        </div>
        <button 
          className="btn btn-dark d-flex align-items-center gap-2"
          onClick={() => alert('La creación de productos se implementará en la siguiente fase de desarrollo.')}
          style={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none' }}
        >
          <i className="fa-light fa-plus"></i> Añadir Producto
        </button>
      </div>

      {/* Filters Card */}
      <div className="card shadow-sm border-0 mb-4 p-3" style={{ borderRadius: '10px' }}>
        <div className="row g-3">
          {/* Search */}
          <div className="col-12 col-md-8">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-md ps-5"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
              <i className="fa-light fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="col-12 col-md-4">
            <select
              className="form-select form-select-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ borderRadius: '8px' }}
            >
              <option value="">Todas las Categorías</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="card shadow-sm border-0 p-4 position-relative" style={{ borderRadius: '10px' }}>
        
        {/* Loading Spinner Overlay */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className="spinner-border text-dark spinner-border-sm me-2" role="status"></div>
            <span className="text-muted small">Buscando productos...</span>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: '0.8rem' }}>
                <th scope="col" style={{ width: '80px' }}>Imagen</th>
                <th scope="col">Nombre</th>
                <th scope="col">SKU</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col" className="text-center">Stock</th>
                <th scope="col" className="text-center">Estado</th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => (
                <tr key={product._id || idx} style={{ fontSize: '0.875rem' }}>
                  <td>
                    {/* Fallback image logic using local CSS Module elements and NO external URLs */}
                    <div className="position-relative" style={{ width: '48px', height: '48px' }}>
                      <img
                        src={product.img}
                        alt={product.title}
                        className="rounded border"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className={styles.placeholderBox} style={{ display: 'none', width: '48px', height: '48px' }}>
                        <i className="fa-light fa-gem" style={{ fontSize: '1rem' }}></i>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-weight-semibold text-dark">{product.title}</div>
                    <small className="text-muted d-block text-truncate" style={{ maxWidth: '280px' }}>{product.description}</small>
                  </td>
                  <td className="text-muted font-monospace">{product.sku || 'N/A'}</td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary border-0">
                      {product.category?.name || product.parent || 'General'}
                    </span>
                  </td>
                  <td className="text-end font-weight-semibold">${product.price?.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={`badge rounded-pill px-2 ${product.quantity < 10 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                      {product.quantity} u
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">Activo</span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-sm btn-outline-secondary p-1 border-0" 
                        onClick={() => alert('La edición de productos se implementará en la siguiente fase de desarrollo.')}
                        title="Editar"
                      >
                        <i className="fa-light fa-pen-to-square fs-6"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger p-1 border-0" 
                        onClick={() => alert('La eliminación de productos se implementará en la siguiente fase de desarrollo.')}
                        title="Eliminar"
                      >
                        <i className="fa-light fa-trash fs-6"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Professional empty state layout */}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="py-4">
                      <i className="fa-light fa-box-open fs-1 text-muted mb-3 d-block"></i>
                      <h6 className="text-dark font-weight-semibold mb-1">No se encontraron productos</h6>
                      <p className="small mb-0 text-muted">Prueba buscando con otros términos o seleccionando otra categoría.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
