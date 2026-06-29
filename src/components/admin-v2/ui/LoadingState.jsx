import React from 'react';
import styles from './design-system.module.scss';

export default function LoadingState({ rows = 4, title = true, className = '' }) {
  return (
    <div className={`${styles.skeletonContainer} ${className}`}>
      {title && <div className={`${styles.skeletonPulse} ${styles.skeletonTitle}`}></div>}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className={`${styles.skeletonPulse} ${styles.skeletonRow}`}></div>
      ))}
    </div>
  );
}
