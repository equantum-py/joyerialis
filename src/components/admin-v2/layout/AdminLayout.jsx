import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './layout.module.scss';
import designStyles from '../ui/design-system.module.scss';
import { ToastWrapper } from '../ui/Toast';

export default function AdminLayout({ children, title = 'Joyerialis ERP - Admin v2' }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebarMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`${designStyles.designSystemRoot} ${styles.layoutRoot}`}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Contenedor Toast para notificaciones globales del ERP */}
      <ToastWrapper />

      {/* Barra Lateral Modular */}
      <Sidebar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsMobileOpen(false)}
        onToggleCollapse={toggleCollapse}
      />

      {/* Estructura Principal */}
      <div
        className={`${styles.mainWrapper} ${
          isCollapsed ? styles.mainWrapperCollapsed : ''
        }`}
      >
        <Header onToggleSidebar={toggleSidebarMobile} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
