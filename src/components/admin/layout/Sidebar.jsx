import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './admin.module.css';
import productsData from '@/data/joyerialis-products.json';

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  
  // Calculate dynamic low stock count from local JSON data
  const products = productsData?.data || [];
  const lowStockCount = products.filter(p => p.quantity !== undefined && p.quantity < 15).length;

  const menuItems = [
    {
      title: 'Inicio',
      items: [
        { label: 'Dashboard', path: '/admin', icon: 'fa-light fa-chart-pie' }
      ]
    },
    {
      title: 'Catálogo',
      items: [
        { label: 'Productos', path: '/admin/productos', icon: 'fa-light fa-gem' },
        { label: 'Categorías', path: '/admin/categorias', icon: 'fa-light fa-tags' }
      ]
    },
    {
      title: 'Ajustes',
      items: [
        { label: 'Configuración', path: '/admin/configuracion', icon: 'fa-light fa-sliders' }
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <>
      {/* Off-canvas sidebar overlay for mobile backdrops */}
      <div 
        className={`${styles.sidebarOverlay} ${isOpen ? styles.sidebarOverlayActive : ''}`} 
        onClick={onClose}
      ></div>

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarActive : ''}`}>
        {/* Brand Header */}
        <div className={`${styles.sidebarHeader} justify-content-between`}>
          <Link href="/admin" className={styles.sidebarBrand}>
            Joyeria<span>lis</span> <small className="text-muted" style={{ fontSize: '0.65rem' }}>Admin</small>
          </Link>
          {/* Close button for mobile layouts */}
          <button 
            className="btn btn-link text-white p-0 d-lg-none" 
            onClick={onClose}
            style={{ textDecoration: 'none' }}
          >
            <i className="fa-light fa-xmark fs-4"></i>
          </button>
        </div>

        {/* Navigation Menus with custom scrollbar class */}
        <div className="flex-grow-1 overflow-auto py-2 sidebar-scrollbar">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <div className={styles.navSectionTitle}>{section.title}</div>
              <nav className="nav flex-column">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.path}
                    className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
                    onClick={onClose} // Auto-close sidebar on mobile navigation
                  >
                    <i className={`${item.icon} ${styles.navIcon}`}></i>
                    <span>{item.label}</span>
                    {item.label === 'Productos' && lowStockCount > 0 && (
                      <span className={styles.badgeLowStock}>{lowStockCount}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-top border-secondary border-opacity-25 text-center">
          <Link href="/" className="btn btn-outline-light btn-sm w-100 text-truncate" target="_blank">
            <i className="fa-light fa-eye me-2"></i> Ver Tienda
          </Link>
        </div>
      </aside>
    </>
  );
}
