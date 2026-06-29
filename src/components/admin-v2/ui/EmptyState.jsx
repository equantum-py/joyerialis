import React from 'react';
import styles from './design-system.module.scss';
import Button from './Button';

export default function EmptyState({
  icon = 'fa-light fa-box-open',
  title = 'No se encontraron registros',
  description = 'No hay datos disponibles para mostrar en esta vista en este momento.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <i className={`${icon} ${styles.emptyStateIcon}`}></i>
      <h4 className={styles.emptyStateTitle}>{title}</h4>
      <p className={styles.emptyStateDesc}>{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
