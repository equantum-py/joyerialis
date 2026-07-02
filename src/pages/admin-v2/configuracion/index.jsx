import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import FormBuilder from '@/components/admin-v2/form/FormBuilder';
import Spinner from '@/components/admin-v2/ui/Spinner';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { settingService } from '@/services/admin-v2/settingService';

export default function AdminV2Settings() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const current = await settingService.getSettings();
        setFormData(current);
        setError('');
      } catch (err) {
        const message = err.message || 'No se pudieron cargar las configuraciones.';
        setError(message);
        erpToast.error(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFormChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (dataToSave) => {
    setSaving(true);
    setError('');

    try {
      const savedSettings = await settingService.updateSettings(dataToSave);
      setFormData(savedSettings);
      erpToast.success('Ajustes generales actualizados correctamente.');
    } catch (err) {
      const message = err.message || 'No se pudieron guardar las configuraciones.';
      setError(message);
      erpToast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'companyName', label: 'Nombre de la Empresa / Tienda', placeholder: 'Joyerialis S.A.' },
    { key: 'supportEmail', label: 'Correo de Contacto / Soporte', placeholder: 'soporte@joyerialis.com' },
    { key: 'phone', label: 'Teléfono de Atención al Cliente', placeholder: '+54 9 11 5555-4444' },
    { key: 'address', label: 'Dirección Comercial Principal', placeholder: 'Av. Alvear 1890, Buenos Aires' },
    { key: 'currency', label: 'Moneda Oficial del ERP', type: 'select', options: [{ label: 'USD ($)', value: 'USD ($)' }, { label: 'EUR (€)', value: 'EUR (€)' }, { label: 'ARS ($)', value: 'ARS ($)' }] },
    { key: 'taxRate', label: 'Porcentaje de Impuestos (%)', type: 'number', placeholder: '21' },
    { key: 'seoTitle', label: 'Título SEO Global de la Tienda', placeholder: 'Joyerialis - Joyería Fina y Exclusiva' },
    { key: 'seoDesc', label: 'Descripción SEO Global', type: 'textarea', placeholder: 'Descubre el catálogo más exclusivo de anillos, collares y pulseras de alta gama.' },
  ];

  return (
    <AdminLayout title="Configuración del Sistema - Joyerialis ERP">
      <CRUDManager title="Ajustes Generales del ERP y Tienda" subtitle="Administración de información comercial, impuestos, preferencias de posicionamiento SEO y correos">
        {error && (
          <div className="alert alert-danger m-4 mb-0" role="alert">
            <i className="fa-light fa-circle-exclamation me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <Spinner text="Cargando preferencias del sistema..." />
        ) : (
          <div className="p-4 bg-white" style={{ maxWidth: '48rem' }}>
            <FormBuilder
              fields={fields}
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              submitLabel={saving ? 'Guardando...' : 'Guardar Configuraciones'}
            />
          </div>
        )}
      </CRUDManager>
    </AdminLayout>
  );
}
