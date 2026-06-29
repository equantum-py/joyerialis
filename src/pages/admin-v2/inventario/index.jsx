import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import SearchAndFilter from '@/components/admin-v2/crud/SearchAndFilter';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Pagination from '@/components/admin-v2/crud/Pagination';
import Modal from '@/components/admin-v2/ui/Modal';
import Badge from '@/components/admin-v2/ui/Badge';
import EmptyState from '@/components/admin-v2/ui/EmptyState';
import LoadingState from '@/components/admin-v2/ui/LoadingState';
import FormBuilder from '@/components/admin-v2/form/FormBuilder';
import { ValidationLayer } from '@/components/admin-v2/form/ValidationLayer';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { inventoryService } from '@/services/admin-v2/inventoryService';

export default function AdminV2Inventory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ type: 'IN' });
  const [formErrors, setFormErrors] = useState({});

  const { data, total, totalPages, loading, refetch } = useDataProvider(inventoryService.getMovements, {
    search,
    type: typeFilter,
    page,
    limit: 10,
  });

  const columns = [
    { key: 'id', label: 'ID Movimiento', render: (val) => <span className="font-monospace text-primary font-weight-bold">{val}</span> },
    { key: 'type', label: 'Tipo', align: 'center', render: (val) => <Badge variant={val === 'IN' ? 'success' : 'warning'}>{val === 'IN' ? 'Entrada (+)' : 'Salida (-)'}</Badge> },
    { key: 'product', label: 'Producto', render: (val, row) => <div><div className="font-weight-bold text-dark">{val}</div><small className="text-muted font-monospace">{row.sku}</small></div> },
    { key: 'qty', label: 'Cantidad', align: 'center', render: (val, row) => <span className={`font-weight-bold ${row.type === 'IN' ? 'text-success' : 'text-warning'}`}>{row.type === 'IN' ? `+${val}` : `-${val}`}</span> },
    { key: 'date', label: 'Fecha', render: (val) => <span className="text-secondary small">{val}</span> },
    { key: 'note', label: 'Nota / Motivo', render: (val) => <span className="text-muted small">{val}</span> },
    { key: 'user', label: 'Registrado por', render: (val) => <span className="badge bg-light text-dark">{val}</span> },
  ];

  const handleAddNew = () => { setFormData({ type: 'IN', product: '', sku: '', qty: '', note: '' }); setFormErrors({}); setIsFormOpen(true); };
  const handleFormChange = (key, value) => setFormData({ ...formData, [key]: value });
  const handleFormSubmit = async (dataToSave) => {
    const schema = { product: { required: true }, qty: { required: true, min: 1 } };
    const { isValid, errors } = ValidationLayer.validateForm(dataToSave, schema);
    if (!isValid) { setFormErrors(errors); erpToast.error('Complete los campos obligatorios correctamente.'); return; }
    await inventoryService.addMovement(dataToSave);
    erpToast.success('Movimiento de inventario registrado exitosamente.');
    setIsFormOpen(false); refetch();
  };

  const formFields = [
    { key: 'type', label: 'Tipo de Movimiento', type: 'select', options: [{ label: 'Entrada de Stock (+)', value: 'IN' }, { label: 'Salida / Ajuste (-)', value: 'OUT' }] },
    { key: 'product', label: 'Nombre del Producto', placeholder: 'Ej. Anillo Solitario Dorado' },
    { key: 'sku', label: 'SKU del Producto', placeholder: 'Ej. SKU-001' },
    { key: 'qty', label: 'Cantidad', type: 'number', placeholder: 'Ej. 10' },
    { key: 'note', label: 'Motivo / Descripción', placeholder: 'Ej. Ingreso por compra a proveedor' },
  ];

  return (
    <AdminLayout title="Inventario - Joyerialis ERP">
      <CRUDManager title="Control de Inventario y Movimientos" subtitle="Registro de entradas, salidas, mermas y alertas de reabastecimiento en tiempo real" actions={[{ label: 'Registrar Movimiento', icon: 'fa-light fa-boxes-packing', onClick: handleAddNew }]}>
        <SearchAndFilter searchPlaceholder="Buscar por producto o ID..." searchValue={search} onSearchChange={(val) => { setSearch(val); setPage(1); }} filters={[{ key: 'type', placeholder: 'Todos los Movimientos', options: [{ label: 'Entradas (+)', value: 'IN' }, { label: 'Salidas (-)', value: 'OUT' }] }]} filterValues={{ type: typeFilter }} onFilterChange={(key, val) => { setTypeFilter(val); setPage(1); }} onReset={() => { setSearch(''); setTypeFilter(''); setPage(1); }} />
        <TableToolbar data={data} exportFilename="movimientos_inventario" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={5} />} emptyState={<EmptyState title="No se encontraron movimientos" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Registrar Movimiento de Stock">
        <FormBuilder fields={formFields} formData={formData} errors={formErrors} onChange={handleFormChange} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} submitLabel="Guardar Movimiento" />
      </Modal>
    </AdminLayout>
  );
}
