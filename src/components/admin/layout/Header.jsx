import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import styles from './admin.module.css';

export default function Header({ onToggleSidebar }) {
  const router = useRouter();
  const { data: session } = useSession();

  // Dinamically determine page title based on path
  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/admin') return 'Panel de Control';
    if (path.startsWith('/admin/productos')) return 'Productos';
    if (path.startsWith('/admin/categorias')) return 'Categorías';
    if (path.startsWith('/admin/configuracion')) return 'Configuración';
    return 'Administración';
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/admin/login' });
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className={styles.header}>
      {/* Page Title & Breadcrumbs */}
      <div className="d-flex align-items-center">
        {/* Toggle Sidebar Button for mobile */}
        <button 
          className={styles.menuToggleBtn} 
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        
        <div>
          <h5 className="mb-0 text-dark font-weight-bold" style={{ fontSize: '1.1rem' }}>{getPageTitle()}</h5>
          <div className={styles.breadcrumbs}>
            <span>Joyerialis</span> / <span className={styles.breadcrumbCurrent}>{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="d-flex align-items-center gap-3">
        {/* Search Bar (Visual placeholder) */}
        <div className="position-relative d-none d-md-block" style={{ width: '250px' }}>
          <input
            type="text"
            className="form-control form-control-sm ps-4 rounded-pill bg-light border-0"
            placeholder="Buscar..."
          />
          <i className="fa-light fa-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" style={{ fontSize: '0.8rem' }}></i>
        </div>

        {/* Notifications Icon */}
        <button className="btn btn-link text-muted p-1 position-relative" style={{ textDecoration: 'none' }}>
          <i className="fa-light fa-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light border-2" style={{ padding: '0.25em 0.4em' }}>
            2
          </span>
        </button>

        {/* Vertical Divider */}
        <div className="vr bg-secondary opacity-25" style={{ height: '24px' }}></div>

        {/* User Info & Dropdown */}
        <div className="dropdown">
          <div
            className={`${styles.userMenu} d-flex align-items-center gap-2`}
            id="adminProfileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className={styles.avatar}>
              {getInitials(session?.user?.name)}
            </div>
            <div className="d-none d-lg-block text-start" style={{ lineHeight: '1.2' }}>
              <div className="font-weight-bold text-dark" style={{ fontSize: '0.85rem' }}>{session?.user?.name || 'Administrador'}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>{session?.user?.email || 'admin@joyerialis.com'}</small>
            </div>
          </div>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="adminProfileDropdown">
            <li className="dropdown-header">Mi Cuenta</li>
            <li>
              <a className="dropdown-item py-2" href="#" onClick={(e) => e.preventDefault()}>
                <i className="fa-light fa-user-gear me-2 text-muted"></i> Mi Perfil
              </a>
            </li>
            <li>
              <a className="dropdown-item py-2" href="#" onClick={(e) => e.preventDefault()}>
                <i className="fa-light fa-shield-halved me-2 text-muted"></i> Seguridad
              </a>
            </li>
            <li><hr className="dropdown-divider bg-light" /></li>
            <li>
              <a className="dropdown-item py-2 text-danger" href="#" onClick={handleLogout}>
                <i className="fa-light fa-arrow-right-from-bracket me-2"></i> Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
