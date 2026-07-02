import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import SearchAndFilter from '@/components/admin-v2/crud/SearchAndFilter';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Pagination from '@/components/admin-v2/crud/Pagination';
import BulkActions from '@/components/admin-v2/crud/BulkActions';
import ConfirmDialog from '@/components/admin-v2/crud/ConfirmDialog';
import Modal from '@/components/admin-v2/ui/Modal';
import Badge from '@/components/admin-v2/ui/Badge';
import Button from '@/components/admin-v2/ui/Button';
import EmptyState from '@/components/admin-v2/ui/EmptyState';
import LoadingState from '@/components/admin-v2/ui/LoadingState';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { productService } from '@/services/admin-v2/productService';
import ProductImage from '@/components/admin/shared/ProductImage';
import MediaUploader from '@/components/admin-v2/media/MediaUploader';
import MediaGrid from '@/components/admin-v2/media/MediaGrid';

export default function AdminV2Products() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Estado de modales y formularios
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Fetch mediante capa de servicios
  const { data, total, totalPages, loading, refetch } = useDataProvider(productService.getAll, {
    search,
    category: categoryFilter,
    status: statusFilter,
    sortBy,
    sortDir,
    page,
    limit: 10,
  });

  const [columns, setColumns] = useState([
    {
      key: 'title',
      label: 'Producto',
      sortable: true,
      render: (val, row) => (
        <div className="d-flex align-items-center gap-2">
          <ProductImage src={row.img} title={val} size="sm" />
          <div className="d-flex flex-column">
            <span className="font-weight-bold text-dark text-truncate" style={{ maxWidth: '200px' }}>{val}</span>
            <small className="text-muted font-monospace">{row.sku}</small>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Categoría', sortable: true, render: (val) => <span className="text-secondary small">{val}</span> },
    { key: 'price', label: 'Precio', sortable: true, align: 'end', render: (val) => <span className="font-weight-bold text-dark">${val?.toLocaleString()}</span> },
    {
      key: 'quantity',
      label: 'Stock',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val < 15 ? 'danger' : 'success'}>
          {val} unds
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val === 'active' ? 'success' : 'neutral'}>
          {val === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
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

  const handleToggleColumn = (key) => {
    setColumns(columns.map(col => col.key === key ? { ...col, hidden: !col.hidden } : col));
  };

  const handleSelectAll = (checked, ids) => {
    setSelectedIds(checked ? ids : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter(item => item !== id));
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  // CRUD Actions
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', sku: '', price: '', quantity: '', category: 'General', status: 'active', img: '', images: [] });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id || row._id);
    setFormData({ title: row.title || '', slug: row.slug || '', sku: row.sku || '', price: row.price || '', quantity: row.quantity ?? '', category: row.category || row.categoryName || 'General', status: row.status || 'active', img: row.img || '', images: row.images || [] });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleConfirmDelete = (id) => {
    setEditingId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await productService.delete(editingId);
      erpToast.success('Producto eliminado correctamente.');
      setIsConfirmDeleteOpen(false);
      refetch();
    } catch (error) {
      erpToast.error(error.message || 'No se pudo eliminar el producto.');
    }
  };

  const handleFormChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleFormSubmit = async (dataToSave) => {
    const errors = {};
    if (!dataToSave.title?.trim()) errors.title = 'El nombre es obligatorio';
    if (!dataToSave.slug?.trim() && !dataToSave.title?.trim()) errors.slug = 'El slug es obligatorio';
    if (dataToSave.price === '' || Number.isNaN(Number(dataToSave.price))) errors.price = 'El precio debe ser numérico';
    if (dataToSave.quantity === '' || Number.isNaN(Number(dataToSave.quantity))) errors.quantity = 'La cantidad debe ser numérica';
    if (!dataToSave.status) errors.status = 'El estado es obligatorio';

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      erpToast.error('Revise los errores en el formulario.');
      return;
    }

    const payload = {
      ...dataToSave,
      slug: dataToSave.slug?.trim() || dataToSave.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, ''),
      img: dataToSave.img || dataToSave.images?.[0]?.url || '',
      images: (dataToSave.images || []).map((image, sortOrder) => ({ ...image, sortOrder })),
    };

    try {
      if (editingId) {
        await productService.update(editingId, payload);
        erpToast.success('Producto actualizado exitosamente.');
      } else {
        await productService.create(payload);
        erpToast.success('Producto creado exitosamente.');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      erpToast.error(error.message || 'No se pudo guardar el producto.');
    }
  };

  // Bulk actions
  const handleBulkStatus = async (status) => {
    try {
      const result = await productService.bulkUpdateStatus(selectedIds, status);
      erpToast.success(`Se actualizaron ${result.count ?? selectedIds.length} productos a ${status}.`);
      setSelectedIds([]);
      refetch();
    } catch (error) {
      erpToast.error(error.message || 'No se pudo actualizar el estado masivo.');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const result = await productService.bulkDelete(selectedIds);
      erpToast.success(`Se eliminaron ${result.count ?? selectedIds.length} productos.`);
      setSelectedIds([]);
      refetch();
    } catch (error) {
      erpToast.error(error.message || 'No se pudo eliminar masivamente.');
    }
  };

  const bulkActionDefinitions = [
    { label: 'Activar', icon: 'fa-light fa-circle-check', onClick: () => handleBulkStatus('active') },
    { label: 'Desactivar', icon: 'fa-light fa-circle-xmark', onClick: () => handleBulkStatus('inactive') },
    { label: 'Eliminar', icon: 'fa-light fa-trash', variant: 'danger', onClick: handleBulkDelete },
  ];

  const filterConfigs = [
    {
      key: 'category',
      placeholder: 'Todas las Categorías',
      options: [
        { label: 'Anillos', value: 'Anillos' },
        { label: 'Collares', value: 'Collares' },
        { label: 'Pulseras', value: 'Pulseras' },
        { label: 'Aros', value: 'Aros' },
      ],
    },
    {
      key: 'status',
      placeholder: 'Todos los Estados',
      options: [
        { label: 'Activos', value: 'active' },
        { label: 'Stock Bajo (<15)', value: 'low_stock' },
      ],
    },
  ];

  const formFields = [
    { key: 'title', label: 'Nombre del Producto', placeholder: 'Ej. Anillo de Diamante' },
    { key: 'slug', label: 'Slug', placeholder: 'Ej. anillo-de-diamante' },
    { key: 'sku', label: 'SKU / Código', placeholder: 'Ej. SKU-9821' },
    { key: 'price', label: 'Precio ($)', type: 'number', placeholder: 'Ej. 1250' },
    { key: 'quantity', label: 'Cantidad en Stock', type: 'number', placeholder: 'Ej. 25' },
    {
      key: 'category',
      label: 'Categoría',
      type: 'select',
      options: [
        { label: 'Anillos', value: 'Anillos' },
        { label: 'Collares', value: 'Collares' },
        { label: 'Pulseras', value: 'Pulseras' },
        { label: 'Aros', value: 'Aros' },
      ],
    },
    {
      key: 'status',
      label: 'Estado Inicial',
      type: 'select',
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' },
      ],
    },
  ];

  return (
    <AdminLayout title="Productos - Joyerialis ERP">
      <CRUDManager
        title="Catálogo de Productos"
        subtitle="Gestión completa del catálogo, existencias, precios y variaciones de joyería"
        actions={[
          { label: 'Nuevo Producto', icon: 'fa-light fa-plus', onClick: handleAddNew },
        ]}
      >
        <BulkActions selectedIds={selectedIds} actions={bulkActionDefinitions} onDeselectAll={() => setSelectedIds([])} />

        <SearchAndFilter
          searchPlaceholder="Buscar por nombre o SKU..."
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          filters={filterConfigs}
          filterValues={{ category: categoryFilter, status: statusFilter }}
          onFilterChange={(key, val) => {
            if (key === 'category') setCategoryFilter(val);
            if (key === 'status') setStatusFilter(val);
            setPage(1);
          }}
          onReset={() => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); setPage(1); }}
        />

        <TableToolbar
          data={data}
          exportFilename="catalogo_productos"
          columns={columns}
          onToggleColumn={handleToggleColumn}
        />

        <GenericTable
          columns={columns}
          data={data}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          loading={loading}
          loadingState={<LoadingState rows={5} />}
          emptyState={<EmptyState title="No se encontraron productos" description="No hay productos que coincidan con los filtros actuales." actionLabel="Limpiar filtros" onAction={() => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); }} />}
        />

        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Editar Producto' : 'Crear Nuevo Producto'} maxWidth="56rem">
        <form onSubmit={(event) => { event.preventDefault(); handleFormSubmit(formData); }} className="d-flex flex-column gap-3">
          <div className="row g-3">
            {formFields.map((field) => (
              <div className="col-12 col-md-6" key={field.key}>
                <label className="form-label small font-weight-bold text-dark">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className={`form-select ${formErrors[field.key] ? 'is-invalid' : ''}`}
                    value={formData[field.key] || ''}
                    onChange={(event) => handleFormChange(field.key, event.target.value)}
                  >
                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : (
                  <input
                    className={`form-control ${formErrors[field.key] ? 'is-invalid' : ''}`}
                    type={field.type || 'text'}
                    value={formData[field.key] || ''}
                    onChange={(event) => handleFormChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
                {formErrors[field.key] && <div className="invalid-feedback d-block">{formErrors[field.key]}</div>}
              </div>
            ))}
          </div>

          <div className="border-top pt-3 mt-2 d-flex flex-column gap-3">
            <div>
              <h6 className="mb-1 text-dark font-weight-bold">Imágenes del producto</h6>
              <p className="mb-0 text-muted small">Sube imágenes desde tu computadora. La imagen seleccionada como principal se mostrará en la tabla.</p>
            </div>
            <MediaUploader
              scope="products"
              folder="products"
              multiple
              title="Subir imágenes"
              description="Arrastra imágenes aquí o haz clic para seleccionar archivos JPEG, PNG, WEBP o AVIF."
              onUploaded={(uploaded) => {
                const uploadedItems = (Array.isArray(uploaded) ? uploaded : [uploaded]).map((item) => ({
                  ...item,
                  id: item.url,
                  sortOrder: formData.images?.length || 0,
                }));
                const nextImages = [...(formData.images || []), ...uploadedItems].map((item, sortOrder) => ({ ...item, sortOrder }));
                setFormData({ ...formData, images: nextImages, img: formData.img || nextImages[0]?.url || '' });
              }}
              onError={(error) => erpToast.error(error.message || 'No se pudo subir el archivo.')}
            />
            <MediaGrid
              title="Galería"
              emptyMessage="Aún no hay imágenes cargadas."
              items={formData.images || []}
              selectedId={formData.img}
              selectedLabel="Principal"
              editableAlt
              sortable
              selectable
              onChange={(nextItems) => {
                const sortedItems = nextItems.map((item, sortOrder) => ({ ...item, sortOrder }));
                setFormData({ ...formData, images: sortedItems, img: sortedItems.some((item) => item.url === formData.img) ? formData.img : sortedItems[0]?.url || '' });
              }}
              onRemove={(item) => {
                const nextImages = (formData.images || []).filter((image) => image.url !== item.url).map((image, sortOrder) => ({ ...image, sortOrder }));
                setFormData({ ...formData, images: nextImages, img: formData.img === item.url ? nextImages[0]?.url || '' : formData.img });
              }}
              onSelect={(item) => setFormData({ ...formData, img: item.url })}
            />
          </div>

          <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-light">
            <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">{editingId ? 'Guardar Cambios' : 'Crear Producto'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message="¿Está seguro de que desea eliminar este producto del catálogo? Esta acción no se puede deshacer."
      />
    </AdminLayout>
  );
}
