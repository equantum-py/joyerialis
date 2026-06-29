import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import SearchAndFilter from '@/components/admin-v2/crud/SearchAndFilter';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Pagination from '@/components/admin-v2/crud/Pagination';
import Drawer from '@/components/admin-v2/ui/Drawer';
import Modal from '@/components/admin-v2/ui/Modal';
import Badge from '@/components/admin-v2/ui/Badge';
import Button from '@/components/admin-v2/ui/Button';
import EmptyState from '@/components/admin-v2/ui/EmptyState';
import LoadingState from '@/components/admin-v2/ui/LoadingState';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { orderService } from '@/services/admin-v2/orderService';

export default function AdminV2Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const { data, total, totalPages, loading, refetch } = useDataProvider(orderService.getAll, {
    search,
    status: statusFilter,
    page,
    limit: 10,
  });

  const handleInspect = async (id) => {
    const order = await orderService.getById(id);
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedOrder) return;
    await orderService.updateStatus(selectedOrder.id, status);
    setSelectedOrder({ ...selectedOrder, status });
    erpToast.success(`Estado del pedido actualizado a ${status}.`);
    refetch();
  };

  const handleAddNoteSubmit = async () => {
    if (!newNote.trim()) return;
    await orderService.addNote(selectedOrder.id, newNote);
    setSelectedOrder({ ...selectedOrder, notes: `${selectedOrder.notes} | ${newNote}` });
    setNewNote('');
    setIsNoteModalOpen(false);
    erpToast.success('Nota interna añadida al pedido.');
    refetch();
  };

  const columns = [
    { key: 'id', label: 'ID Pedido', render: (val) => <span className="font-monospace text-primary font-weight-bold">{val}</span> },
    { key: 'client', label: 'Cliente', render: (val, row) => <div><div className="font-weight-bold text-dark">{val}</div><small className="text-muted">{row.email}</small></div> },
    { key: 'date', label: 'Fecha', render: (val) => <span className="text-secondary small">{val}</span> },
    { key: 'paymentMethod', label: 'Pago', render: (val) => <span className="badge bg-light text-dark">{val}</span> },
    { key: 'total', label: 'Total', align: 'end', render: (val) => <span className="font-weight-bold text-dark">${val.toLocaleString()}</span> },
    {
      key: 'status',
      label: 'Estado',
      align: 'center',
      render: (val) => (
        <Badge variant={val === 'Completado' ? 'success' : val === 'Procesando' ? 'info' : val === 'Pendiente' ? 'warning' : 'danger'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Detalle',
      align: 'center',
      render: (_, row) => (
        <Button variant="outline" size="sm" onClick={() => handleInspect(row.id)}>
          <i className="fa-light fa-eye me-1"></i> Inspeccionar
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout title="Pedidos - Joyerialis ERP">
      <CRUDManager title="Gestión de Pedidos y Despachos" subtitle="Supervisión del ciclo de vida de transacciones, facturación, notas de entrega y estados">
        <SearchAndFilter searchPlaceholder="Buscar por ID, cliente o email..." searchValue={search} onSearchChange={(val) => { setSearch(val); setPage(1); }} filters={[{ key: 'status', placeholder: 'Todos los Estados', options: [{ label: 'Completado', value: 'Completado' }, { label: 'Procesando', value: 'Procesando' }, { label: 'Pendiente', value: 'Pendiente' }, { label: 'Cancelado', value: 'Cancelado' }] }]} filterValues={{ status: statusFilter }} onFilterChange={(key, val) => { setStatusFilter(val); setPage(1); }} onReset={() => { setSearch(''); setStatusFilter(''); setPage(1); }} />
        <TableToolbar data={data} exportFilename="pedidos_joyerialis" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={5} />} emptyState={<EmptyState title="No se encontraron pedidos" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={`Inspección de Pedido ${selectedOrder?.id}`} maxWidth="32rem">
        {selectedOrder && (
          <div className="d-flex flex-column gap-4">
            <div className="card border-0 bg-light p-4" style={{ borderRadius: '12px' }}>
              <h5 className="font-weight-bold text-dark mb-3">Información General</h5>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Cliente:</span><strong className="text-dark small">{selectedOrder.client}</strong></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Email:</span><strong className="text-dark small">{selectedOrder.email}</strong></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Fecha:</span><strong className="text-dark small">{selectedOrder.date}</strong></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Método de Pago:</span><strong className="text-dark small">{selectedOrder.paymentMethod}</strong></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Seguimiento:</span><strong className="text-primary font-monospace small">{selectedOrder.tracking || 'No asignado'}</strong></div>
              <div className="d-flex justify-content-between mt-2 pt-2 border-top border-secondary border-opacity-10"><span className="text-dark font-weight-bold">Total Pagado:</span><strong className="text-primary fs-5">${selectedOrder.total.toLocaleString()}</strong></div>
            </div>

            <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h5 className="font-weight-bold text-dark mb-3">Ítems del Pedido</h5>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between py-2 border-bottom border-light last-border-0">
                  <span className="font-weight-medium text-dark small">{item.title} <strong className="text-primary">(x{item.qty})</strong></span>
                  <strong className="text-dark small">${item.price.toLocaleString()}</strong>
                </div>
              ))}
            </div>

            <div className="card border-0 bg-light p-4" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="font-weight-bold text-dark mb-0">Notas Internas</h5>
                <Button variant="outline" size="sm" onClick={() => setIsNoteModalOpen(true)}>+ Añadir Nota</Button>
              </div>
              <p className="mb-0 text-muted small font-italic">{selectedOrder.notes}</p>
            </div>

            <div className="d-flex flex-column gap-2">
              <h5 className="font-weight-bold text-dark mb-2">Acciones de Estado</h5>
              <div className="d-flex flex-wrap gap-2">
                <Button variant={selectedOrder.status === 'Completado' ? 'primary' : 'outline'} size="sm" onClick={() => handleUpdateStatus('Completado')}>Completado</Button>
                <Button variant={selectedOrder.status === 'Procesando' ? 'primary' : 'outline'} size="sm" onClick={() => handleUpdateStatus('Procesando')}>Procesando</Button>
                <Button variant={selectedOrder.status === 'Pendiente' ? 'primary' : 'outline'} size="sm" onClick={() => handleUpdateStatus('Pendiente')}>Pendiente</Button>
                <Button variant={selectedOrder.status === 'Cancelado' ? 'danger' : 'outline'} size="sm" onClick={() => handleUpdateStatus('Cancelado')}>Cancelar Pedido</Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Añadir Nota Interna al Pedido" footer={<><Button variant="outline" onClick={() => setIsNoteModalOpen(false)}>Cancelar</Button><Button variant="primary" onClick={handleAddNoteSubmit}>Guardar Nota</Button></>}>
        <div className="mb-3">
          <label className="form-label font-weight-bold small text-dark">Nueva Nota / Registro de Despacho</label>
          <textarea className="form-control" rows="4" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Escriba los detalles del envío o requerimientos del cliente..."></textarea>
        </div>
      </Modal>
    </AdminLayout>
  );
}
