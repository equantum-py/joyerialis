import React from 'react';
import ExportSystem from '../export/ExportSystem';
import ColumnManager from './ColumnManager';

export default function TableToolbar({
  data = [],
  exportFilename = 'exportacion',
  columns = [],
  onToggleColumn,
  customAction = null,
}) {
  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-3 bg-white border-bottom border-light">
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted small font-weight-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Herramientas de Tabla</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        {customAction}
        {columns.length > 0 && onToggleColumn && (
          <ColumnManager columns={columns} onToggleColumn={onToggleColumn} />
        )}
        <ExportSystem data={data} filename={exportFilename} />
      </div>
    </div>
  );
}
