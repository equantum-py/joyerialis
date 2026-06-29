import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin-v2/layout/AdminLayout';
import CRUDManager from '@/components/admin-v2/crud/CRUDManager';
import TableToolbar from '@/components/admin-v2/crud/TableToolbar';
import GenericTable from '@/components/admin-v2/crud/GenericTable';
import Select from '@/components/admin-v2/ui/Select';
import Spinner from '@/components/admin-v2/ui/Spinner';
import { reportService } from '@/services/admin-v2/reportService';

export default function AdminV2Reports() {
  const [reportType, setReportType] = useState('ventas');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await reportService.getReportData(reportType, 'last_30_days');
      setData(res);
      setLoading(false);
    }
    load();
  }, [reportType]);

  const getColumns = () => {
    if (reportType === 'ventas') {
      return [
        { key: 'fecha', label: 'Fecha', render: (val) => <span className="font-monospace text-secondary">{val}</span> },
        { key: 'orden', label: 'Orden', render: (val) => <span className="font-weight-bold text-primary">{val}</span> },
        { key: 'cliente', label: 'Cliente', render: (val) => <span className="text-dark font-weight-medium">{val}</span> },
        { key: 'metodo', label: 'Método de Pago', align: 'center', render: (val) => <span className="badge bg-light text-dark">{val}</span> },
        { key: 'total', label: 'Monto Total', align: 'end', render: (val) => <span className="font-weight-bold text-dark">${val.toLocaleString()}</span> },
      ];
    }
    if (reportType === 'productos') {
      return [
        { key: 'sku', label: 'SKU', render: (val) => <span className="font-monospace text-secondary">{val}</span> },
        { key: 'producto', label: 'Producto', render: (val) => <span className="font-weight-bold text-dark">{val}</span> },
        { key: 'vendidos', label: 'Unidades Vendidas', align: 'center', render: (val) => <span className="badge bg-primary text-white">{val}</span> },
        { key: 'stock', label: 'Stock Actual', align: 'center', render: (val) => <span className="badge bg-light text-dark">{val}</span> },
        { key: 'ingresos', label: 'Ingresos Generados', align: 'end', render: (val) => <span className="font-weight-bold text-success">${val.toLocaleString()}</span> },
      ];
    }
    if (reportType === 'clientes') {
      return [
        { key: 'cliente', label: 'Cliente', render: (val, row) => <div><div className="font-weight-bold text-dark">{val}</div><small className="text-muted">{row.email}</small></div> },
        { key: 'compras', label: 'Cantidad de Compras', align: 'center', render: (val) => <span className="badge bg-light text-dark font-weight-bold">{val}</span> },
        { key: 'gastado', label: 'Total Invertido', align: 'end', render: (val) => <span className="font-weight-bold text-primary">${val.toLocaleString()}</span> },
      ];
    }
    return [];
  };

  return (
    <AdminLayout title="Reportes Analíticos - Joyerialis ERP">
      <CRUDManager title="Centro de Reportes y Exportación" subtitle="Generación de reportes avanzados de comercialización, rendimiento de catálogo y comportamiento de clientes con exportación a CSV, JSON y PDF">
        <div className="p-4 bg-white border-bottom border-light d-flex align-items-center gap-3 flex-wrap">
          <div style={{ width: '280px' }}>
            <Select
              label="Seleccione el Tipo de Reporte"
              options={[
                { label: 'Reporte Consolidado de Ventas', value: 'ventas' },
                { label: 'Rendimiento de Productos y Rotación', value: 'productos' },
                { label: 'Comportamiento y Valor de Clientes', value: 'clientes' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mb-0"
            />
          </div>
        </div>
        <TableToolbar data={data} exportFilename={`reporte_${reportType}`} />
        <GenericTable columns={getColumns()} data={data} loading={loading} loadingState={<Spinner text="Generando reporte consolidado..." />} />
      </CRUDManager>
    </AdminLayout>
  );
}
