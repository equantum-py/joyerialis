import React from 'react';
import Button from '../ui/Button';

export default function ColumnManager({ columns = [], onToggleColumn }) {
  return (
    <div className="dropdown">
      <Button
        variant="outline"
        size="sm"
        id="columnManagerDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        icon="fa-light fa-table-columns"
      >
        Columnas
      </Button>
      <div className="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3" aria-labelledby="columnManagerDropdown" style={{ width: '240px' }}>
        <h6 className="dropdown-header px-0 text-dark font-weight-bold">Visibilidad de Columnas</h6>
        <div className="d-flex flex-column gap-2 mt-2">
          {columns.map((col, idx) => (
            <div key={idx} className="form-check">
              <input
                type="checkbox"
                className="form-check-input cursor-pointer"
                id={`col-toggle-${idx}`}
                checked={!col.hidden}
                onChange={() => onToggleColumn(col.key)}
              />
              <label className="form-check-label text-dark small cursor-pointer" htmlFor={`col-toggle-${idx}`}>
                {col.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
