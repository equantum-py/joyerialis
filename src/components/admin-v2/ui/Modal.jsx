import React from 'react';
import styles from './design-system.module.scss';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '32rem',
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalContainer}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Cerrar modal">
            <i className="fa-light fa-xmark"></i>
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
        {footer ? (
          <div className={styles.modalFooter}>{footer}</div>
        ) : (
          <div className={styles.modalFooter}>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
