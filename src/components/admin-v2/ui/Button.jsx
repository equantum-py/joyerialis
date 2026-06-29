import React from 'react';
import styles from './design-system.module.scss';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon,
  className = '',
  ...props
}) {
  // Determine variant class
  let variantClass = styles.btnPrimary;
  if (variant === 'secondary') variantClass = styles.btnSecondary;
  if (variant === 'outline') variantClass = styles.btnOutline;
  if (variant === 'ghost') variantClass = styles.btnGhost;
  if (variant === 'danger') variantClass = styles.btnDanger;

  // Determine size class
  let sizeClass = '';
  if (size === 'sm') sizeClass = styles.btnSm;
  if (size === 'lg') sizeClass = styles.btnLg;

  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      ) : (
        icon && <i className={`${icon} me-2`}></i>
      )}
      {children}
    </button>
  );
}
