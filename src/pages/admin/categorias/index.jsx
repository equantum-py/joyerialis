import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/admin/layout/Layout';
import categoriesData from '@/data/joyerialis-categories.json';
import styles from '@/components/admin/layout/admin.module.css';

export default function Categorias() {
  const categories = categoriesData?.result || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Simulate loading state on search change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter categories based on search term
  const filteredCategories = categories.filter(c => {
    return c.parent && c.parent.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  return (
    <Layout>
      <Head>
        <title>Categorías - Joyerialis Admin</title>
      </Head>

      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="mb-1 text-dark font-weight-bold">Categorías</h4>
          <p className="mb-0 text-muted small">Gestiona los grupos de organización de tus productos en el catálogo.</p>
        </div>
        <button 
          className="btn btn-dark d-flex align-items-center gap-2"
          onClick={() => alert('La creación de categorías se implementará en la siguiente fase de desarrollo.')}
          style={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none' }}
        >
          <i className="fa-light fa-plus"></i> Añadir Categoría
        </button>
      </div>

      {/* Search Input Card */}
      <div className="card shadow-sm border-0 mb-4 p-3" style={{ borderRadius: '10px' }}>
        <div className="position-relative">
          <input
            type="text"
            className="form-control form-control-md ps-5"
            placeholder="Buscar por nombre de categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '8px' }}
          />
          <i className="fa-light fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="card shadow-sm border-0 p-4 position-relative" style={{ borderRadius: '10px' }}>
        
        {/* Loading Spinner Overlay */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className="spinner-border text-dark spinner-border-sm me-2" role="status"></div>
            <span className="text-muted small">Buscando categorías...</span>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: '0.8rem' }}>
                <th scope="col" style={{ width: '80px' }}>Miniatura</th>
                <th scope="col">Nombre</th>
                <th scope="col">Tipo de Producto</th>
                <th scope="col" className="text-center">Productos Asoc.</th>
                <th scope="col" className="text-center">Estado</th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, idx) => (
                <tr key={category._id || idx} style={{ fontSize: '0.875rem' }}>
                  <td>
                    {/* Fallback image logic using local CSS Module elements and NO external URLs */}
                    <div className="position-relative" style={{ width: '48px', height: '48px' }}>
                      <img
                        src={category.img}
                        alt={category.parent}
                        className="rounded border"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className={styles.placeholderBox} style={{ display: 'none', width: '48px', height: '48px' }}>
                        <i className="fa-light fa-tags" style={{ fontSize: '1rem' }}></i>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-weight-semibold text-dark">{category.parent}</div>
                    <small className="text-muted d-block font-monospace" style={{ fontSize: '0.75rem' }}>ID: {category._id}</small>
                  </td>
                  <td className="text-capitalize text-muted">{category.productType || 'Joyería'}</td>
                  <td className="text-center font-weight-semibold">
                    <span className="badge bg-light text-dark rounded-pill px-3 py-1 border">
                      {category.products?.length || 0} items
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">Activo</span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-sm btn-outline-secondary p-1 border-0" 
                        onClick={() => alert('La edición de categorías se implementará en la siguiente fase de desarrollo.')}
                        title="Editar"
                      >
                        <i className="fa-light fa-pen-to-square fs-6"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger p-1 border-0" 
                        onClick={() => alert('La eliminación de categorías se implementará en la siguiente fase de desarrollo.')}
                        title="Eliminar"
                      >
                        <i className="fa-light fa-trash fs-6"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Professional empty state layout */}
              {filteredCategories.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div className="py-4">
                      <i className="fa-light fa-folder-open fs-1 text-muted mb-3 d-block"></i>
                      <h6 className="text-dark font-weight-semibold mb-1">No se encontraron categorías</h6>
                      <p className="small mb-0 text-muted">Prueba buscando con otro término.</p>
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
