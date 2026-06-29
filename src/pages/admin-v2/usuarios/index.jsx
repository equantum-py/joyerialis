import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import SearchAndFilter from '@/components/admin-v2/crud/SearchAndFilter';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Pagination from '@/components/admin-v2/crud/Pagination';
import ConfirmDialog from '@/components/admin-v2/crud/ConfirmDialog';
import Modal from '@/components/admin-v2/ui/Modal';
import Badge from '@/components/admin-v2/ui/Badge';
import Button from '@/components/admin-v2/ui/Button';
import EmptyState from '@/components/admin-v2/ui/EmptyState';
import LoadingState from '@/components/admin-v2/ui/LoadingState';
import FormBuilder from '@/components/admin-v2/form/FormBuilder';
import { ValidationLayer } from '@/components/admin-v2/form/ValidationLayer';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { userService } from '@/services/admin-v2/userService';

export default function AdminV2Users() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const { data, total, totalPages, loading, refetch } = useDataProvider(userService.getAll, {
    search,
    role: roleFilter,
    page,
    limit: 10,
  });

  const columns = [
    { key: 'name', label: 'Usuario', render: (val, row) => <div><div className="font-weight-bold text-dark">{val}</div><small className="text-muted">{row.email}</small></div> },
    { key: 'role', label: 'Rol / Permisos', align: 'center', render: (val) => <Badge variant={val === 'SUPER_ADMIN' ? 'warning' : val === 'ADMIN' ? 'primary' : 'info'}>{val}</Badge> },
    { key: 'lastLogin', label: 'Último Acceso', render: (val) => <span className="text-secondary small">{val}</span> },
    { key: 'status', label: 'Estado', align: 'center', render: (val) => <Badge variant={val === 'Activo' ? 'success' : 'neutral'}>{val}</Badge> },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}><i className="fa-light fa-pen"></i></Button>
          <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleConfirmDelete(row.id)}><i className="fa-light fa-trash"></i></Button>
        </div>
      ),
    },
  ];

  const handleAddNew = () => { setEditingId(null); setFormData({ name: '', email: '', role: 'EDITOR', status: 'Activo' }); setFormErrors({}); setIsFormOpen(true); };
  const handleEdit = (row) => { setEditingId(row.id); setFormData({ name: row.name, email: row.email, role: row.role, status: row.status }); setFormErrors({}); setIsFormOpen(true); };
  const handleConfirmDelete = (id) => { setEditingId(id); setIsConfirmDeleteOpen(true); };
  const handleDelete = async () => { await userService.delete(editingId); erpToast.success('Usuario eliminado.'); setIsConfirmDeleteOpen(false); refetch(); };

  const handleFormChange = (key, value) => setFormData({ ...formData, [key]: value });
  const handleFormSubmit = async (dataToSave) => {
    const schema = { name: { required: true }, email: { required: true, email: true } };
    const { isValid, errors } = ValidationLayer.validateForm(dataToSave, schema);
    if (!isValid) { setFormErrors(errors); erpToast.error('Revise los errores en el formulario.'); return; }
    if (editingId) { await userService.update(editingId, dataToSave); erpToast.success('Usuario actualizado.'); } else { await userService.create(dataToSave); erpToast.success('Usuario registrado.'); }
    setIsFormOpen(false); refetch();
  };

  const formFields = [
    { key: 'name', label: 'Nombre del Administrador', placeholder: 'Ej. Juan Pérez' },
    { key: 'email', label: 'Correo Electrónico', placeholder: 'Ej. juan@joyerialis.com' },
    { key: 'role', label: 'Rol en el Sistema', type: 'select', options: [{ label: 'SUPER_ADMIN (Acceso Total)', value: 'SUPER_ADMIN' }, { label: 'ADMIN (Gestión Comercial)', value: 'ADMIN' }, { label: 'EDITOR (Solo Catálogo)', value: 'EDITOR' }] },
    { key: 'status', label: 'Estado de Cuenta', type: 'select', options: [{ label: 'Activo', value: 'Activo' }, { label: 'Inactivo', value: 'Inactivo' }] },
  ];

  return (
    <AdminLayout title="Usuarios - Joyerialis ERP">
      <CRUDManager title="Control de Acceso y Roles de Usuario" subtitle="Gestión de administradores y estructura jerárquica (SUPER_ADMIN, ADMIN, EDITOR) preparada para la autenticación final" actions={[{ label: 'Registrar Usuario', icon: 'fa-light fa-user-shield', onClick: handleAddNew }]}>
        <SearchAndFilter searchPlaceholder="Buscar usuario..." searchValue={search} onSearchChange={(val) => { setSearch(val); setPage(1); }} filters={[{ key: 'role', placeholder: 'Todos los Roles', options: [{ label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' }, { label: 'ADMIN', value: 'ADMIN' }, { label: 'EDITOR', value: 'EDITOR' }] }]} filterValues={{ role: roleFilter }} onFilterChange={(key, val) => { setRoleFilter(val); setPage(1); }} onReset={() => { setSearch(''); setRoleFilter(''); setPage(1); }} />
        <TableToolbar data={data} exportFilename="usuarios_erp" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={4} />} emptyState={<EmptyState title="No se encontraron usuarios" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Editar Usuario' : 'Registrar Usuario'}>
        <FormBuilder fields={formFields} formData={formData} errors={formErrors} onChange={handleFormChange} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} submitLabel={editingId ? 'Guardar' : 'Registrar'} />
      </Modal>
      <ConfirmDialog isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} onConfirm={handleDelete} title="Eliminar Usuario" message="¿Está seguro de que desea eliminar este usuario?" />
    </AdminLayout>
  );
}
