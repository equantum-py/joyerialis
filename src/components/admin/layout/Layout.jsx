import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from '@/utils/toast';
import styles from './admin.module.css';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-panel-wrapper d-flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main workspace area */}
      <div className={`${styles.adminMain} d-flex flex-column min-vh-100`}>
        {/* Header toolbar */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic page content */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
}
