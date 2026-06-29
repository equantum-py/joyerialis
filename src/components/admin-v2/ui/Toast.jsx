import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Envoltura ERP personalizada para notificaciones
export function ToastWrapper() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}

// Métodos de utilidad estandarizados para el ERP
export const erpToast = {
  success: (msg) => toast.success(msg, { className: 'erp-toast-success' }),
  error: (msg) => toast.error(msg, { className: 'erp-toast-error' }),
  warning: (msg) => toast.warn(msg, { className: 'erp-toast-warning' }),
  info: (msg) => toast.info(msg, { className: 'erp-toast-info' }),
};
