import React, { useState, useEffect, useCallback } from 'react';
import { erpToast } from '../ui/Toast';

// Hook proveedor de datos que maneja la carga desde servicios ERP
export function useDataProvider(serviceFetch, params = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serializar params para evitar renders infinitos si se pasan objetos en línea
  const serializedParams = JSON.stringify(params);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const parsedParams = JSON.parse(serializedParams);
      const res = await serviceFetch(parsedParams);
      setData(res.data || res || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      erpToast.error(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [serviceFetch, serializedParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, total, totalPages, loading, error, refetch: loadData };
}

export default function DataProvider({ serviceFetch, params = {}, render }) {
  const state = useDataProvider(serviceFetch, params);
  return render(state);
}
