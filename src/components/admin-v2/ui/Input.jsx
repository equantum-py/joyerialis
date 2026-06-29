import React from 'react';
import styles from './design-system.module.scss';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  iconPrefix,
  iconSuffix,
  className = '',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.inputLabel}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {iconPrefix && <i className={`${iconPrefix} ${styles.inputIconPrefix}`}></i>}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${styles.inputField} ${iconPrefix ? styles.inputFieldWithPrefix : ''} ${
            iconSuffix ? styles.inputFieldWithSuffix : ''
          } ${error ? styles.inputFieldError : ''}`}
          {...props}
        />
        {iconSuffix && <i className={`${iconSuffix} ${styles.inputIconSuffix}`}></i>}
      </div>
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
}
