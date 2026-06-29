import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function FormBuilder({
  fields = [],
  formData = {},
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  loading = false,
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="d-flex flex-column gap-3">
      {fields.map((field, idx) => {
        if (field.type === 'select') {
          return (
            <Select
              key={idx}
              label={field.label}
              options={field.options}
              value={formData[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              error={errors[field.key]}
              placeholder={field.placeholder}
            />
          );
        }
        if (field.type === 'textarea') {
          return (
            <div key={idx} className="d-flex flex-column mb-3">
              <label className="font-weight-bold small text-dark mb-1">{field.label}</label>
              <textarea
                className={`form-control ${errors[field.key] ? 'border-danger' : ''}`}
                value={formData[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows || 3}
              ></textarea>
              {errors[field.key] && <span className="text-danger small mt-1">{errors[field.key]}</span>}
            </div>
          );
        }
        return (
          <Input
            key={idx}
            label={field.label}
            type={field.type || 'text'}
            value={formData[field.key] || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            error={errors[field.key]}
            iconPrefix={field.icon}
          />
        );
      })}

      <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-light">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
        )}
        <Button variant="primary" type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
