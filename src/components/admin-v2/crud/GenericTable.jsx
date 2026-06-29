import React from 'react';
import styles from '../ui/design-system.module.scss';

export default function GenericTable({
  columns = [],
  data = [],
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  sortBy,
  sortDir,
  onSort,
  emptyState = null,
  loadingState = null,
  loading = false,
}) {
  if (loading && loadingState) return loadingState;
  if (!loading && data.length === 0 && emptyState) return emptyState;

  const allSelected = data.length > 0 && data.every(item => selectedIds.includes(item.id || item._id));

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
            {onSelectAll && (
              <th scope="col" style={{ width: '40px' }} className="text-center">
                <input
                  type="checkbox"
                  className="form-check-input cursor-pointer"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked, data.map(d => d.id || d._id))}
                />
              </th>
            )}
            {columns.map((col, idx) => {
              if (col.hidden) return null;
              const isSorted = sortBy === col.key;
              return (
                <th
                  key={idx}
                  scope="col"
                  className={`${col.align ? `text-${col.align}` : ''} ${col.sortable ? 'cursor-pointer' : ''}`}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', width: col.width }}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className={`d-inline-flex align-items-center gap-1`}>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <i className={`fa-light ${isSorted ? (sortDir === 'asc' ? 'fa-arrow-up-small' : 'fa-arrow-down-small') : 'fa-arrows-up-down'} text-muted`}></i>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            const rowId = row.id || row._id;
            const isSelected = selectedIds.includes(rowId);
            return (
              <tr key={rowId || rowIdx} className={isSelected ? 'bg-primary bg-opacity-10' : ''} style={{ fontSize: '0.875rem' }}>
                {onSelectRow && (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input cursor-pointer"
                      checked={isSelected}
                      onChange={(e) => onSelectRow(rowId, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map((col, colIdx) => {
                  if (col.hidden) return null;
                  return (
                    <td key={colIdx} className={col.align ? `text-${col.align}` : ''}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
