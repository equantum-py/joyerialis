import React, { useState } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import SearchAndFilter from '@/components/admin-v2/crud/SearchAndFilter';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Pagination from '@/components/admin-v2/crud/Pagination';
import EmptyState from '@/components/admin-v2/ui/EmptyState';
import LoadingState from '@/components/admin-v2/ui/LoadingState';
import { useDataProvider } from '@/components/admin-v2/crud/DataProvider';
import { activityLogService } from '@/services/admin-v2/activityLogService';

export default function AdminV2Logs() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, total, totalPages, loading } = useDataProvider(activityLogService.getAll, {
    search,
    module: moduleFilter,
    page,
    limit: 10,
  });

  const columns = [
    { key: 'id', label: 'ID Log', render: (val) => <span className="font-monospace text-secondary font-weight-bold">{val}</span> },
    { key: 'time', label: 'Marca de Tiempo', render: (val) => <span className="text-muted small font-monospace">{val}</span> },
    { key: 'user', label: 'Administrador', render: (val) => <span className="font-weight-bold text-dark">{val}</span> },
    { key: 'module', label: 'Módulo', align: 'center', render: (val) => <span className="badge bg-primary bg-opacity-10 text-primary font-weight-bold">{val}</span> },
    { key: 'action', label: 'Operación', render: (val, row) => <span className="text-dark small">{val} <strong className="text-primary">{row.target}</strong></span> },
    { key: 'ip', label: 'Dirección IP', align: 'center', render: (val) => <span className="font-monospace text-secondary small">{val}</span> },
  ];

  return (
    <AdminLayout title="Activity Logs - Joyerialis ERP">
      <CRUDManager title="Registro de Actividades (Audit Logs)" subtitle="Auditoría de operaciones del sistema, seguimiento de modificaciones de catálogo y despacho de pedidos">
        <SearchAndFilter searchPlaceholder="Buscar por administrador o target..." searchValue={search} onSearchChange={(val) => { setSearch(val); setPage(1); }} filters={[{ key: 'module', placeholder: 'Todos los Módulos', options: [{ label: 'Productos', value: 'Productos' }, { label: 'Inventario', value: 'Inventario' }, { label: 'Pedidos', value: 'Pedidos' }, { label: 'Cupones', value: 'Cupones' }, { label: 'Backups', value: 'Backups' }] }]} filterValues={{ module: moduleFilter }} onFilterChange={(key, val) => { setModuleFilter(val); setPage(1); }} onReset={() => { setSearch(''); setModuleFilter(''); setPage(1); }} />
        <TableToolbar data={data} exportFilename="auditoria_erp" />
        <GenericTable columns={columns} data={data} loading={loading} loadingState={<LoadingState rows={5} />} emptyState={<EmptyState title="No se encontraron registros de auditoría" />} />
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </CRUDManager>
    </AdminLayout>
  );
}
