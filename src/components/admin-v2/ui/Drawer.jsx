import React from 'react';
import styles from './design-system.module.scss';
import Button from './Button';

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '28rem',
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose}></div>
      <div className={styles.drawerContainer} style={{ maxWidth }}>
        <div className={styles.drawerHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Cerrar drawer">
            <i className="fa-light fa-xmark"></i>
          </button>
        </div>
        <div className={styles.drawerBody}>{children}</div>
        {footer && <div className={styles.drawerFooter}>{footer}</div>}
      </div>
    </>
  );
}
