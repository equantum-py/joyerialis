import React from 'react';
import Button from '../ui/Button';

export default function BulkActions({ selectedIds = [], actions = [], onDeselectAll }) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="d-flex align-items-center justify-content-between p-3 bg-primary bg-opacity-10 border-bottom border-primary border-opacity-25">
      <div className="d-flex align-items-center gap-3">
        <span className="badge bg-primary text-white py-1 px-2 font-weight-bold" style={{ fontSize: '0.85rem' }}>
          {selectedIds.length} seleccionados
        </span>
        <span className="text-dark small font-weight-medium">Elige una acción masiva para aplicar:</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        {actions.map((act, idx) => (
          <Button
            key={idx}
            variant={act.variant || 'secondary'}
            size="sm"
            icon={act.icon}
            onClick={() => act.onClick(selectedIds)}
          >
            {act.label}
          </Button>
        ))}
        {onDeselectAll && (
          <Button variant="ghost" size="sm" onClick={onDeselectAll}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}
