import React from 'react';
import Button from '../ui/Button';

export default function CRUDManager({
  title,
  subtitle,
  actions = [],
  children,
}) {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Cabecera del Módulo */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="mb-1 text-dark font-weight-bold" style={{ fontSize: '1.5rem' }}>{title}</h2>
          {subtitle && <p className="mb-0 text-muted small">{subtitle}</p>}
        </div>
        <div className="d-flex align-items-center gap-2">
          {actions.map((act, idx) => (
            <Button
              key={idx}
              variant={act.variant || 'primary'}
              icon={act.icon}
              onClick={act.onClick}
              disabled={act.disabled}
            >
              {act.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
