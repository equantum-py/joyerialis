import React from 'react';
import Select from '../ui/Select';

export default function SortManager({ sortOptions = [], sortBy, sortDir, onSortChange }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <Select
        options={sortOptions}
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value, sortDir)}
        placeholder="Ordenar por..."
        className="mb-0"
      />
      <button
        className="btn btn-outline-dark btn-sm p-2"
        onClick={() => onSortChange(sortBy, sortDir === 'asc' ? 'desc' : 'asc')}
        title="Alternar dirección"
      >
        <i className={`fa-light ${sortDir === 'asc' ? 'fa-arrow-down-a-z' : 'fa-arrow-up-z-a'}`}></i>
      </button>
    </div>
  );
}
