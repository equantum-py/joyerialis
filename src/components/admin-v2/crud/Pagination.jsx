import React from 'react';
import Button from '../ui/Button';

export default function Pagination({ page = 1, totalPages = 1, onPageChange, total = 0, limit = 10 }) {
  if (totalPages <= 1 && total === 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-3 bg-white border-top border-light">
      <div className="text-muted small">
        Mostrando <strong>{startRecord}</strong> - <strong>{endRecord}</strong> de <strong>{total}</strong> registros
      </div>
      <div className="d-flex align-items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <i className="fa-light fa-chevron-left"></i>
        </Button>
        <span className="px-3 small font-weight-semibold text-dark">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <i className="fa-light fa-chevron-right"></i>
        </Button>
      </div>
    </div>
  );
}
