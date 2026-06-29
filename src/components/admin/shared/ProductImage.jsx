import React from 'react';
import styles from '@/components/admin/layout/admin.module.css';

export default function ProductImage({ src, title, size = 'md', className = '' }) {
  const isSmall = size === 'sm';
  const boxSize = isSmall ? '36px' : '48px';
  const iconSize = isSmall ? '0.8rem' : '1rem';
  
  // Custom styled CSS Module placeholder class selector
  const placeholderClass = isSmall ? styles.placeholderBoxSm : styles.placeholderBox;

  if (!src) {
    return (
      <div 
        className={`${placeholderClass} ${className}`} 
        style={{ width: boxSize, height: boxSize }}
      >
        <i className="fa-light fa-gem" style={{ fontSize: iconSize }}></i>
      </div>
    );
  }

  return (
    <div className="position-relative" style={{ width: boxSize, height: boxSize, flexShrink: 0 }}>
      <img
        src={src}
        alt={title || 'Producto'}
        className={`rounded border ${className}`}
        style={{ width: boxSize, height: boxSize, objectFit: 'cover' }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div 
        className={placeholderClass} 
        style={{ display: 'none', width: boxSize, height: boxSize }}
      >
        <i className="fa-light fa-gem" style={{ fontSize: iconSize }}></i>
      </div>
    </div>
  );
}
