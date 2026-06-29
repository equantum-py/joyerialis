import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './layout.module.scss';

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const router = useRouter();

  // Estructura modular completa solicitada en la Fase 1
  const menuSections = [
    {
      title: 'Principal',
      items: [
        { label: 'Dashboard', path: '/admin-v2', icon: 'fa-light fa-chart-pie' },
      ],
    },
    {
      title: 'Ventas',
      items: [
        { label: 'Pedidos', path: '/admin-v2/pedidos', icon: 'fa-light fa-cart-shopping' },
        { label: 'Clientes', path: '/admin-v2/clientes', icon: 'fa-light fa-users' },
      ],
    },
    {
      title: 'Catálogo',
      items: [
        { label: 'Productos', path: '/admin-v2/productos', icon: 'fa-light fa-gem' },
        { label: 'Categorías', path: '/admin-v2/categorias', icon: 'fa-light fa-tags' },
        { label: 'Inventario', path: '/admin-v2/inventario', icon: 'fa-light fa-boxes-stacked' },
      ],
    },
    {
      title: 'Comercialización',
      items: [
        { label: 'Cupones', path: '/admin-v2/cupones', icon: 'fa-light fa-ticket' },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Usuarios', path: '/admin-v2/usuarios', icon: 'fa-light fa-user-shield' },
        { label: 'Reportes', path: '/admin-v2/reportes', icon: 'fa-light fa-file-chart-column' },
        { label: 'Configuración', path: '/admin-v2/configuracion', icon: 'fa-light fa-sliders' },
        { label: 'Backups', path: '/admin-v2/backups', icon: 'fa-light fa-database' },
        { label: 'Activity Logs', path: '/admin-v2/logs', icon: 'fa-light fa-list-timeline' },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/admin-v2') {
      return router.pathname === '/admin-v2';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay para dispositivos móviles */}
      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.sidebarOverlayActive : ''}`}
        onClick={onClose}
      ></div>

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarMobileOpen : ''} ${
          isCollapsed ? styles.sidebarCollapsed : ''
        }`}
      >
        {/* Cabecera del Sidebar */}
        <div className={styles.sidebarHeader}>
          <Link href="/admin-v2" className={styles.sidebarBrand}>
            <i className="fa-solid fa-cube text-primary"></i>
            <span className={styles.sidebarBrandText}>Joyerialis ERP</span>
          </Link>
          <button
            className={styles.collapseToggleBtn}
            onClick={onToggleCollapse}
            aria-label="Colapsar sidebar"
          >
            <i className={`fa-light ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
          </button>
        </div>

        {/* Menú de Navegación */}
        <div className={styles.sidebarNav}>
          {menuSections.map((section, idx) => (
            <div key={idx} className={styles.navSection}>
              <div className={styles.navSectionTitle}>{section.title}</div>
              <nav className="nav flex-column gap-1">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.path}
                    className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
                    onClick={onClose} // Cerrar en móviles al navegar
                    title={isCollapsed ? item.label : undefined}
                  >
                    <i className={`${item.icon} ${styles.navIcon}`}></i>
                    <span className={styles.navLinkText}>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Pie del Sidebar */}
        <div className={styles.sidebarFooter}>
          <Link
            href="/"
            className={`btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2`}
            target="_blank"
            title="Ver tienda pública"
          >
            <i className="fa-light fa-display"></i>
            {!isCollapsed && <span>Ver Tienda</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
