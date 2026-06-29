// Capa de validación genérica y reutilizable para el ERP
export const ValidationLayer = {
  validateField(value, rules = {}) {
    if (rules.required && (!value || `${value}`.trim() === '')) {
      return rules.requiredMessage || 'Este campo es obligatorio.';
    }
    if (rules.min && Number(value) < rules.min) {
      return `El valor mínimo permitido es ${rules.min}.`;
    }
    if (rules.max && Number(value) > rules.max) {
      return `El valor máximo permitido es ${rules.max}.`;
    }
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Ingrese un correo electrónico válido.';
    }
    return null;
  },

  validateForm(formData, schema = {}) {
    const errors = {};
    let isValid = true;

    Object.keys(schema).forEach((key) => {
      const error = this.validateField(formData[key], schema[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    return { isValid, errors };
  }
};
