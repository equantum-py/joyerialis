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
import { customerService } from '@/services/admin-v2/customerService';

export default function AdminV2Customers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const { data, total, totalPages, loading, refetch } = useDataProvider(customerService.getAll, {
    search,
    status: statusFilter,
    page,
    limit: 10,
  });

  const columns = [
    { key: 'name', label: 'Cliente', render: (val, row) => <div><div className="font-weight-bold text-dark">{val}</div><small className="text-muted">{row.email}</small></div> },
    { key: 'phone', label: 'Teléfono', render: (val) => <span className="text-secondary small">{val || 'No registrado'}</span> },
    { key: 'address', label: 'Dirección', render: (val) => <span className="text-muted small text-truncate" style={{ maxWidth: '180px' }}>{val}</span> },
    { key: 'ordersCount', label: 'Pedidos', align: 'center', render: (val) => <span className="badge bg-light text-dark font-weight-bold">{val}</span> },
    { key: 'totalSpent', label: 'Monto Gastado', align: 'end', render: (val) => <span className="font-weight-bold text-primary">${val.toLocaleString()}</span> },
    { key: 'status', label: 'Estado', align: 'center', render: (val) => <Badge variant={val === 'VIP' ? 'warning' : val === 'Activo' ? 'success' : 'neutral'}>{val}</Badge> },
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

  const handleAddNew = () => { setEditingId(null); setFormData({ name: '', email: '', phone: '', address: '', status: 'Activo' }); setFormErrors({}); setIsFormOpen(true); };
  const handleEdit = (row) => { setEditingId(row.id); setFormData({ name: row.name, email: row.email, phone: row.phone, address: row.address, status: row.status }); setFormErrors({}); setIsFormOpen(true); };
  const handleConfirmDelete = (id) => { setEditingId(id); setIsConfirmDeleteOpen(true); };
  const handleDelete = async () => { await customerService.delete(editingId); erpToast.success('Cliente eliminado correctamente.'); setIsConfirmDeleteOpen(false); refetch(); };

  const handleFormChange = (key, value) => setFormData({ ...formData, [key]: value });
  const handleFormSubmit = async (dataToSave) => {
    const schema = { name: { required: true }, email: { required: true, email: true } };
    const { isValid, errors } = ValidationLayer.validateForm(dataToSave, schema);
    if (!isValid) { setFormErrors(errors); erpToast.error('Revise los errores en el formulario.'); return; }
    if (editingId) { await customerService.update(editingId, dataToSave); erpToast.success('Cliente actualizado.'); } else { await customerService.create(dataToSave); erpToast.success('Cliente registrado.'); }
    setIsFormOpen(false); refetch();
  };

  const formFields = [
    { key: 'name', label: 'Nombre del Cliente', placeholder: 'Ej. Lucía Blanco' },
    { key: 'email', label: 'Correo Electrónico', placeholder: 'Ej. lucia@blanco.com' },
    { key: 'phone', label: 'Teléfono de Contacto', placeholder: 'Ej. +54 9 11 2211-7766' },
    { key: 'address', label: 'Dirección de Entrega', placeholder: 'Ej. Mendoza 1540, Rosario' },
    { key: 'status', label: 'Estado / Segmento', type: 'select', options: [{ label: 'Activo', value: 'Activo' }, { label: 'VIP', value: 'VIP' }, { label: 'Inactivo', value: 'Inactivo' }] },
  ];

  return (
    <AdminLayout title="Clientes - Joyerialis ERP">
      <CRUDManager title="Cartera de Clientes" subtitle="Perfiles de compradores, historiales de pedidos, valor vitalicio y segmentación" actions={[{ label: 'Registrar Cliente', icon: 'fa-light fa-user-plus', onClick: handleAddNew }]}>
        <SearchAndFilter searchPlaceholder="Buscar por nombre o email..." searchValue={search} onSearchChange={(val) => { setSearch(val); setPage(1); }} filters={[{ key: 'status', placeholder: 'Todos los Segmentos', options: [{ label: 'Activos', value: 'Activo' }, { label: 'VIP', value: 'VIP' }, { label: 'Inactivos', value: 'Inactivo' }] }]} filterValues={{ status: statusFilter }} onFilterChange={(key, val) => { setStatusFilter(val); setPage(1); }} onReset={() => { setSearch(''); setStatusFilter(''); setPage(1); }} />
        <TableToolbar data={data} exportFilename="clientes_erp" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={5} />} emptyState={<EmptyState title="No se encontraron clientes" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Editar Cliente' : 'Registrar Cliente'}>
        <FormBuilder fields={formFields} formData={formData} errors={formErrors} onChange={handleFormChange} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} submitLabel={editingId ? 'Guardar' : 'Registrar'} />
      </Modal>
      <ConfirmDialog isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} onConfirm={handleDelete} title="Eliminar Cliente" message="¿Está seguro de que desea eliminar este cliente?" />
    </AdminLayout>
  );
}
