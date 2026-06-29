import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function SearchAndFilter({
  searchPlaceholder = 'Buscar registros...',
  searchValue = '',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onReset,
}) {
  const hasActiveFilters = searchValue || Object.values(filterValues).some(v => v !== '');

  return (
    <div className="d-flex flex-wrap align-items-center gap-3 p-3 bg-white border-bottom border-light">
      <div className="flex-grow-1" style={{ minWidth: '260px' }}>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          iconPrefix="fa-light fa-search"
          className="mb-0"
        />
      </div>

      {filters.map((filter, idx) => (
        <div key={idx} style={{ width: filter.width || '180px' }}>
          <Select
            options={filter.options}
            value={filterValues[filter.key] || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || 'Filtrar...'}
            className="mb-0"
          />
        </div>
      ))}

      {hasActiveFilters && onReset && (
        <button
          className="btn btn-link text-muted d-flex align-items-center gap-1 p-0 small"
          style={{ textDecoration: 'none' }}
          onClick={onReset}
        >
          <i className="fa-light fa-circle-xmark"></i>
          <span>Limpiar filtros</span>
        </button>
      )}
    </div>
  );
}
