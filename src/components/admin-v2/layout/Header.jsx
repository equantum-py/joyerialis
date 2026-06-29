import React from 'react';
import { useRouter } from 'next/router';
import { useAdminSession } from '@/context/AdminSessionContext';
import styles from './layout.module.scss';

export default function Header({ onToggleSidebar }) {
  const router = useRouter();
  const { session } = useAdminSession();

  // Título dinámico según la ruta actual en admin-v2
  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/admin-v2') return 'Dashboard';
    if (path.startsWith('/admin-v2/pedidos')) return 'Pedidos';
    if (path.startsWith('/admin-v2/clientes')) return 'Clientes';
    if (path.startsWith('/admin-v2/productos')) return 'Productos';
    if (path.startsWith('/admin-v2/categorias')) return 'Categorías';
    if (path.startsWith('/admin-v2/inventario')) return 'Inventario';
    if (path.startsWith('/admin-v2/cupones')) return 'Cupones';
    if (path.startsWith('/admin-v2/usuarios')) return 'Usuarios';
    if (path.startsWith('/admin-v2/reportes')) return 'Reportes';
    if (path.startsWith('/admin-v2/configuracion')) return 'Configuración';
    if (path.startsWith('/admin-v2/backups')) return 'Backups';
    if (path.startsWith('/admin-v2/logs')) return 'Activity Logs';
    return 'Panel Corporativo';
  };

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className={styles.header}>
      {/* Parte Izquierda: Título y Migas de Pan */}
      <div className={styles.headerLeft}>
        <button
          className={styles.menuToggleBtn}
          onClick={onToggleSidebar}
          aria-label="Alternar menú lateral"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <div>
          <h1 className={styles.headerTitle}>{getPageTitle()}</h1>
          <div className={styles.breadcrumbs}>
            <span>Joyerialis ERP</span> / <span className={styles.breadcrumbCurrent}>{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* Parte Derecha: Buscador Global, Alertas y Perfil */}
      <div className={styles.headerRight}>
        {/* Búsqueda rápida */}
        <div className="position-relative d-none d-md-block" style={{ width: '240px' }}>
          <input
            type="text"
            className="form-control form-control-sm ps-4 rounded-pill bg-light border-0"
            placeholder="Búsqueda global..."
          />
          <i className="fa-light fa-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" style={{ fontSize: '0.8rem' }}></i>
        </div>

        {/* Icono de notificaciones */}
        <button className="btn btn-link text-secondary p-1 position-relative" style={{ textDecoration: 'none' }}>
          <i className="fa-light fa-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
            3
          </span>
        </button>

        <div className="vr bg-secondary opacity-25" style={{ height: '24px' }}></div>

        {/* Perfil del Administrador */}
        <div className="dropdown">
          <div
            className={styles.userMenu}
            id="erpAdminDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className={styles.avatar}>
              {getInitials(session?.user?.name)}
            </div>
            <div className="d-none d-lg-block text-start" style={{ lineHeight: '1.2' }}>
              <div className="font-weight-bold text-dark" style={{ fontSize: '0.85rem' }}>
                {session?.user?.name || 'Super Admin'}
              </div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {session?.user?.role || 'SUPER_ADMIN'}
              </small>
            </div>
          </div>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="erpAdminDropdown">
            <li className="dropdown-header">Conectado como {session?.user?.email}</li>
            <li>
              <a className="dropdown-item py-2" href="#" onClick={(e) => e.preventDefault()}>
                <i className="fa-light fa-user-gear me-2 text-muted"></i> Mi Perfil
              </a>
            </li>
            <li>
              <a className="dropdown-item py-2" href="#" onClick={(e) => e.preventDefault()}>
                <i className="fa-light fa-sliders me-2 text-muted"></i> Preferencias ERP
              </a>
            </li>
            <li><hr className="dropdown-divider bg-light" /></li>
            <li>
              <a className="dropdown-item py-2 text-muted" href="#" onClick={(e) => {
                e.preventDefault();
                alert('El login/logout definitivo será habilitado en la fase final de autenticación.');
              }}>
                <i className="fa-light fa-arrow-right-from-bracket me-2 text-danger"></i> Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
