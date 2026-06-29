import React from 'react';
import styles from './design-system.module.scss';

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  className = '',
  placeholder = 'Seleccione una opción',
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.inputLabel}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className={`${styles.inputField} ${error ? styles.inputFieldError : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
}
