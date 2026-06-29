import React from 'react';
import styles from './design-system.module.scss';

export default function Spinner({ text = 'Cargando datos...', className = '' }) {
  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <div className={styles.spinner} role="status"></div>
      {text && <span className={styles.spinnerText}>{text}</span>}
    </div>
  );
}
