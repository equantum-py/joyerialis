import React from 'react';
import Button from '../ui/Button';
import { erpToast } from '../ui/Toast';

export default function ExportSystem({ data = [], filename = 'exportacion_erp' }) {
  const exportToCSV = () => {
    if (data.length === 0) {
      erpToast.warning('No hay datos para exportar.');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    erpToast.success('Exportación CSV completada exitosamente.');
  };

  const exportToJSON = () => {
    if (data.length === 0) {
      erpToast.warning('No hay datos para exportar.');
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `${filename}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    erpToast.success('Exportación JSON completada exitosamente.');
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <Button variant="outline" size="sm" onClick={exportToCSV}>
        <i className="fa-light fa-file-csv me-2"></i> CSV
      </Button>
      <Button variant="outline" size="sm" onClick={exportToJSON}>
        <i className="fa-light fa-file-code me-2"></i> JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => erpToast.info('Generando exportación en PDF...')}>
        <i className="fa-light fa-file-pdf me-2"></i> PDF
      </Button>
    </div>
  );
}
