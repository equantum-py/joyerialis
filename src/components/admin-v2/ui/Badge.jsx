import React from 'react';
import styles from './design-system.module.scss';

export default function Badge({ children, variant = 'neutral', icon, className = '' }) {
  let variantClass = styles.badgeNeutral;
  if (variant === 'success') variantClass = styles.badgeSuccess;
  if (variant === 'warning') variantClass = styles.badgeWarning;
  if (variant === 'danger') variantClass = styles.badgeDanger;
  if (variant === 'info') variantClass = styles.badgeInfo;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {icon && <i className={`${icon} me-1`}></i>}
      {children}
    </span>
  );
}
