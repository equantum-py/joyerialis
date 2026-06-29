import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import SearchAndFilter from '@/components/admin-v2/crud/SearchAndFilter';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
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
import { categoryService } from '@/services/admin-v2/categoryService';

export default function AdminV2Categories() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const { data, loading, refetch } = useDataProvider(categoryService.getAll, {
    search,
    sortBy,
    sortDir,
  });

  const [columns, setColumns] = useState([
    { key: 'name', label: 'Categoría', sortable: true, render: (val) => <span className="font-weight-bold text-dark">{val}</span> },
    { key: 'slug', label: 'Slug / URL', sortable: true, render: (val) => <span className="text-muted font-monospace">{val}</span> },
    { key: 'parent', label: 'Jerarquía', render: (val) => <span className="text-secondary small">{val || 'Ninguna (Principal)'}</span> },
    { key: 'status', label: 'Estado', align: 'center', render: (val) => <Badge variant={val === 'active' ? 'success' : 'neutral'}>{val === 'active' ? 'Activo' : 'Inactivo'}</Badge> },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <i className="fa-light fa-pen"></i>
          </Button>
          <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleConfirmDelete(row.id || row._id)}>
            <i className="fa-light fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ]);

  const handleToggleColumn = (key) => setColumns(columns.map(col => col.key === key ? { ...col, hidden: !col.hidden } : col));
  const handleSort = (key) => { if (sortBy === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); else { setSortBy(key); setSortDir('asc'); } };

  const handleAddNew = () => { setEditingId(null); setFormData({ name: '', slug: '', parent: 'Ninguna', status: 'active' }); setFormErrors({}); setIsFormOpen(true); };
  const handleEdit = (row) => { setEditingId(row.id || row._id); setFormData({ name: row.name, slug: row.slug, parent: row.parent || 'Ninguna', status: row.status || 'active' }); setFormErrors({}); setIsFormOpen(true); };
  const handleConfirmDelete = (id) => { setEditingId(id); setIsConfirmDeleteOpen(true); };
  const handleDelete = async () => { await categoryService.delete(editingId); erpToast.success('Categoría eliminada correctamente.'); setIsConfirmDeleteOpen(false); refetch(); };

  const handleFormChange = (key, value) => setFormData({ ...formData, [key]: value });
  const handleFormSubmit = async (dataToSave) => {
    const schema = { name: { required: true, requiredMessage: 'El nombre es obligatorio' } };
    const { isValid, errors } = ValidationLayer.validateForm(dataToSave, schema);
    if (!isValid) { setFormErrors(errors); erpToast.error('Revise los errores en el formulario.'); return; }
    if (editingId) { await categoryService.update(editingId, dataToSave); erpToast.success('Categoría actualizada exitosamente.'); } else { await categoryService.create(dataToSave); erpToast.success('Categoría creada exitosamente.'); }
    setIsFormOpen(false); refetch();
  };

  const formFields = [
    { key: 'name', label: 'Nombre de la Categoría', placeholder: 'Ej. Colección Diamante' },
    { key: 'slug', label: 'Slug (Opcional)', placeholder: 'Ej. coleccion-diamante' },
    { key: 'parent', label: 'Categoría Padre', type: 'select', options: [{ label: 'Ninguna (Principal)', value: 'Ninguna' }, { label: 'Anillos', value: 'Anillos' }, { label: 'Collares', value: 'Collares' }] },
    { key: 'status', label: 'Estado', type: 'select', options: [{ label: 'Activo', value: 'active' }, { label: 'Inactivo', value: 'inactive' }] },
  ];

  return (
    <AdminLayout title="Categorías - Joyerialis ERP">
      <CRUDManager title="Jerarquía de Categorías" subtitle="Organización del catálogo, jerarquías multinivel y posicionamiento SEO" actions={[{ label: 'Nueva Categoría', icon: 'fa-light fa-folder-plus', onClick: handleAddNew }]}>
        <SearchAndFilter searchPlaceholder="Buscar categorías..." searchValue={search} onSearchChange={setSearch} />
        <TableToolbar data={data} exportFilename="categorias_erp" columns={columns} onToggleColumn={handleToggleColumn} />
        <GenericTable columns={columns} data={data} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} loading={loading} loadingState={<LoadingState rows={4} />} emptyState={<EmptyState title="No se encontraron categorías" />} />
      </CRUDManager>
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Editar Categoría' : 'Crear Categoría'}>
        <FormBuilder fields={formFields} formData={formData} errors={formErrors} onChange={handleFormChange} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} submitLabel={editingId ? 'Guardar' : 'Crear'} />
      </Modal>
      <ConfirmDialog isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} onConfirm={handleDelete} title="Eliminar Categoría" message="¿Está seguro de que desea eliminar esta categoría?" />
    </AdminLayout>
  );
}
