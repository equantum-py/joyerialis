import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/admin/layout/Layout';

export default function Admin404() {
  return (
    <Layout>
      <Head>
        <title>Página No Encontrada - Joyerialis Admin</title>
      </Head>

      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="mb-4">
          <i className="fa-light fa-compass-slash text-muted" style={{ fontSize: '5rem' }}></i>
        </div>
        
        <h1 className="display-5 font-weight-bold text-dark mb-2">404</h1>
        <h4 className="text-secondary mb-3">Página No Encontrada en el Panel</h4>
        
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '480px' }}>
          Lo sentimos, la ruta administrativa que estás intentando acceder no existe o ha sido movida. Verifica la URL o regresa al Dashboard principal.
        </p>

        <Link 
          href="/admin" 
          className="btn btn-dark px-4 py-2 font-weight-semibold"
          style={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none' }}
        >
          <i className="fa-light fa-house-chimney me-2"></i> Volver al Inicio
        </Link>
      </div>
    </Layout>
  );
}
