import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import FormBuilder from '@/components/admin-v2/form/FormBuilder';
import { erpToast } from '@/components/admin-v2/ui/Toast';

export default function AdminV2Profile() {
  const [formData, setFormData] = useState({
    name: 'Super Admin',
    email: 'super@joyerialis.com',
    role: 'SUPER_ADMIN',
    phone: '+54 9 11 9999-8888',
  });

  const handleFormChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = (dataToSave) => {
    erpToast.success('Perfil de usuario actualizado exitosamente.');
  };

  const fields = [
    { key: 'name', label: 'Nombre Completo', placeholder: 'Ej. Super Admin' },
    { key: 'email', label: 'Correo Electrónico', placeholder: 'Ej. super@joyerialis.com' },
    { key: 'phone', label: 'Teléfono Directo', placeholder: 'Ej. +54 9 11 9999-8888' },
    { key: 'role', label: 'Rol Asignado (Solo Lectura)', type: 'select', options: [{ label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' }] },
  ];

  return (
    <AdminLayout title="Mi Perfil - Joyerialis ERP">
      <CRUDManager title="Perfil de Cuenta y Credenciales" subtitle="Administración de información personal, preferencias de sesión y credenciales de acceso al ERP">
        <div className="p-4 bg-white" style={{ maxWidth: '40rem' }}>
          <FormBuilder
            fields={fields}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            submitLabel="Actualizar Perfil"
          />
        </div>
      </CRUDManager>
    </AdminLayout>
  );
}
