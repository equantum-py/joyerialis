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
import { couponService } from '@/services/admin-v2/couponService';

export default function AdminV2Coupons() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const { data, total, totalPages, loading, refetch } = useDataProvider(couponService.getAll, {
    search,
    status: statusFilter,
    page,
    limit: 10,
  });

  const columns = [
    { key: 'code', label: 'Código de Cupón', render: (val) => <span className="font-monospace text-primary font-weight-bold fs-6">{val}</span> },
    { key: 'discount', label: 'Descuento', align: 'center', render: (val, row) => <span className="badge bg-light text-dark font-weight-bold">{row.discountType === 'percentage' ? `${val}%` : `$${val}`}</span> },
    { key: 'startDate', label: 'Vigencia', render: (val, row) => <span className="text-secondary small">{val} al {row.endDate}</span> },
    { key: 'usageLimit', label: 'Uso / Límite', align: 'center', render: (val, row) => <span className="text-muted small">{row.usedCount} / {val}</span> },
    { key: 'minAmount', label: 'Compra Mínima', align: 'end', render: (val) => <span className="font-weight-semibold text-dark">${val}</span> },
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

  const handleAddNew = () => { setEditingId(null); setFormData({ code: '', discount: '', discountType: 'percentage', startDate: '', endDate: '', usageLimit: 100, minAmount: 0, status: 'Activo' }); setFormErrors({}); setIsFormOpen(true); };
  const handleEdit = (row) => { setEditingId(row.id); setFormData({ code: row.code, discount: row.discount, discountType: row.discountType, startDate: row.startDate, endDate: row.endDate, usageLimit: row.usageLimit, minAmount: row.minAmount, status: row.status }); setFormErrors({}); setIsFormOpen(true); };
  const handleConfirmDelete = (id) => { setEditingId(id); setIsConfirmDeleteOpen(true); };
  const handleDelete = async () => { await couponService.delete(editingId); erpToast.success('Cupón eliminado.'); setIsConfirmDeleteOpen(false); refetch(); };

  const handleFormChange = (key, value) => setFormData({ ...formData, [key]: value });
  const handleFormSubmit = async (dataToSave) => {
    const schema = { code: { required: true }, discount: { required: true, min: 1 } };
    const { isValid, errors } = ValidationLayer.validateForm(dataToSave, schema);
    if (!isValid) { setFormErrors(errors); erpToast.error('Revise los errores en el formulario.'); return; }
    if (editingId) { await couponService.update(editingId, dataToSave); erpToast.success('Cupón actualizado.'); } else { await couponService.create(dataToSave); erpToast.success('Cupón creado.'); }
    setIsFormOpen(false); refetch();
  };

  const formFields = [
    { key: 'code', label: 'Código del Cupón', placeholder: 'Ej. VERANO2026' },
    { key: 'discountType', label: 'Tipo de Descuento', type: 'select', options: [{ label: 'Porcentaje (%)', value: 'percentage' }, { label: 'Monto Fijo ($)', value: 'fixed' }] },
    { key: 'discount', label: 'Valor del Descuento', type: 'number', placeholder: 'Ej. 15' },
    { key: 'minAmount', label: 'Monto Mínimo de Compra ($)', type: 'number', placeholder: 'Ej. 500' },
    { key: 'usageLimit', label: 'Límite de Usos', type: 'number', placeholder: 'Ej. 100' },
    { key: 'status', label: 'Estado', type: 'select', options: [{ label: 'Activo', value: 'Activo' }, { label: 'Inactivo', value: 'Inactivo' }] },
  ];

  return (
    <AdminLayout title="Cupones - Joyerialis ERP">
      <CRUDManager title="Reglas y Cupones de Descuento" subtitle="Gestión de códigos promocionales, límites de uso, fechas de vigencia y restricciones de compra" actions={[{ label: 'Crear Cupón', icon: 'fa-light fa-ticket', onClick: handleAddNew }]}>
        <SearchAndFilter searchPlaceholder="Buscar código..." searchValue={search} onSearchChange={(val) => { setSearch(val); setPage(1); }} filters={[{ key: 'status', placeholder: 'Todos los Estados', options: [{ label: 'Activos', value: 'Activo' }, { label: 'Inactivos', value: 'Inactivo' }] }]} filterValues={{ status: statusFilter }} onFilterChange={(key, val) => { setStatusFilter(val); setPage(1); }} onReset={() => { setSearch(''); setStatusFilter(''); setPage(1); }} />
        <TableToolbar data={data} exportFilename="cupones_erp" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={4} />} emptyState={<EmptyState title="No se encontraron cupones" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Editar Cupón' : 'Crear Cupón'}>
        <FormBuilder fields={formFields} formData={formData} errors={formErrors} onChange={handleFormChange} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} submitLabel={editingId ? 'Guardar' : 'Crear'} />
      </Modal>
      <ConfirmDialog isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} onConfirm={handleDelete} title="Eliminar Cupón" message="¿Está seguro de que desea eliminar este cupón?" />
    </AdminLayout>
  );
}
