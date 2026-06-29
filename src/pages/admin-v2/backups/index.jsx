import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Pagination from '@/components/admin-v2/crud/Pagination';
import ConfirmDialog from '@/components/admin-v2/crud/ConfirmDialog';
import Badge from '@/components/admin-v2/ui/Badge';
import Button from '@/components/admin-v2/ui/Button';
import EmptyState from '@/components/admin-v2/ui/EmptyState';
import LoadingState from '@/components/admin-v2/ui/LoadingState';
import { erpToast } from '@/components/admin-v2/ui/Toast';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { backupService } from '@/services/admin-v2/backupService';

export default function AdminV2Backups() {
  const [page, setPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data, total, totalPages, loading, refetch } = useDataProvider(backupService.getAll, {
    page,
    limit: 10,
  });

  const handleCreateBackup = async () => {
    erpToast.info('Iniciando creación de backup de base de datos...');
    await backupService.createBackup('Manual');
    erpToast.success('Copia de seguridad generada y empaquetada correctamente.');
    refetch();
  };

  const handleConfirmDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    await backupService.deleteBackup(deletingId);
    erpToast.success('Backup eliminado exitosamente.');
    setIsConfirmOpen(false);
    refetch();
  };

  const columns = [
    { key: 'name', label: 'Archivo de Backup', render: (val) => <span className="font-monospace text-primary font-weight-bold"><i className="fa-light fa-file-zipper me-2"></i>{val}</span> },
    { key: 'size', label: 'Tamaño', align: 'center', render: (val) => <span className="badge bg-light text-dark font-weight-semibold">{val}</span> },
    { key: 'date', label: 'Fecha de Generación', render: (val) => <span className="text-secondary small font-monospace">{val}</span> },
    { key: 'type', label: 'Tipo', align: 'center', render: (val) => <Badge variant={val === 'Automático' ? 'info' : 'warning'}>{val}</Badge> },
    { key: 'status', label: 'Estado', align: 'center', render: (val) => <Badge variant="success">{val}</Badge> },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <div className="d-flex align-items-center justify-content-center gap-2">
          <Button variant="outline" size="sm" onClick={() => erpToast.success(`Descargando ${row.name}...`)}><i className="fa-light fa-download me-1"></i> Descargar</Button>
          <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleConfirmDelete(row.id)}><i className="fa-light fa-trash"></i></Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Backups del Sistema - Joyerialis ERP">
      <CRUDManager title="Copias de Seguridad (Backups)" subtitle="Gestión de puntos de restauración, exportación de bases de datos y empaquetado de archivos sql.gz" actions={[{ label: 'Generar Backup Manual', icon: 'fa-light fa-database', onClick: handleCreateBackup }]}>
        <TableToolbar data={data} exportFilename="historial_backups" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={4} />} emptyState={<EmptyState title="No se encontraron copias de seguridad" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Eliminar Copia de Seguridad" message="¿Está seguro de que desea eliminar este archivo de backup del servidor?" />
    </AdminLayout>
  );
}
