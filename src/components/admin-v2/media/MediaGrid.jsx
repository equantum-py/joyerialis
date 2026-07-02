import React from 'react';
import Button from '@/components/admin-v2/ui/Button';

export default function MediaGrid({
  items = [],
  title = 'Archivos',
  emptyMessage = 'No hay archivos cargados.',
  selectedId,
  selectedLabel = 'Seleccionado',
  editableAlt = false,
  sortable = false,
  selectable = false,
  altLabel = 'Texto ALT',
  removeLabel = 'Quitar',
  onChange,
  onRemove,
  onSelect,
}) {
  const updateItem = (id, patch) => {
    onChange?.(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const moveItem = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const nextItems = [...items];
    const [item] = nextItems.splice(index, 1);
    nextItems.splice(nextIndex, 0, item);
    onChange?.(nextItems.map((entry, sortOrder) => ({ ...entry, sortOrder })));
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="mb-0 text-dark font-weight-bold">{title}</h6>
        <span className="badge bg-light text-muted border">{items.length} archivo(s)</span>
      </div>

      {items.length === 0 ? (
        <div className="border rounded-3 p-3 text-center text-muted small bg-light">{emptyMessage}</div>
      ) : (
        <div className="row g-3">
          {items.map((item, index) => {
            const itemId = item.id || item.url;
            const isSelected = selectedId === itemId || selectedId === item.url;

            return (
              <div className="col-12 col-md-6" key={itemId}>
                <div className={`border rounded-3 p-3 h-100 ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'}`}>
                  <div className="d-flex gap-3">
                    <img
                      src={item.url}
                      alt={item.alt || item.filename || 'Media'}
                      className="rounded border"
                      style={{ width: '86px', height: '86px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="small text-dark font-weight-semibold text-truncate">
                          {item.filename || item.pathname || item.url}
                        </span>
                        {isSelected && <span className="badge bg-primary">{selectedLabel}</span>}
                      </div>

                      {editableAlt && (
                        <div className="mb-2">
                          <label className="form-label small text-muted mb-1">{altLabel}</label>
                          <input
                            className="form-control form-control-sm"
                            value={item.alt || ''}
                            onChange={(event) => updateItem(itemId, { alt: event.target.value })}
                            placeholder="Descripción accesible"
                          />
                        </div>
                      )}

                      <div className="d-flex flex-wrap align-items-center gap-2">
                        {selectable && (
                          <Button variant={isSelected ? 'primary' : 'outline'} size="sm" type="button" onClick={() => onSelect?.(item)}>
                            {isSelected ? selectedLabel : 'Seleccionar'}
                          </Button>
                        )}
                        {sortable && (
                          <>
                            <Button variant="ghost" size="sm" type="button" disabled={index === 0} onClick={() => moveItem(index, -1)}>
                              <i className="fa-light fa-arrow-up"></i>
                            </Button>
                            <Button variant="ghost" size="sm" type="button" disabled={index === items.length - 1} onClick={() => moveItem(index, 1)}>
                              <i className="fa-light fa-arrow-down"></i>
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" type="button" className="text-danger" onClick={() => onRemove?.(item)}>
                          {removeLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
