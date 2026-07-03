import { useEffect, useMemo, useState } from 'react';

const EMPTY_RESPONSE = { data: [] };

function usePublicProducts(queryString = '') {
  const [state, setState] = useState({ data: EMPTY_RESPONSE, isLoading: true, isError: false });

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(queryString || '');
    const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;

    setState((current) => ({ ...current, isLoading: true, isError: false }));

    fetch(url)
      .then(async (res) => {
        const payload = await res.json().catch(() => EMPTY_RESPONSE);
        if (!res.ok) throw new Error(payload?.message || 'Error al cargar productos');
        return payload;
      })
      .then((payload) => {
        if (active) setState({ data: { data: payload?.data || [] }, isLoading: false, isError: false });
      })
      .catch(() => {
        if (active) setState({ data: EMPTY_RESPONSE, isLoading: false, isError: true });
      });

    return () => {
      active = false;
    };
  }, [queryString]);

  return state;
}

function buildQuery(query) {
  if (!query) return '';
  if (typeof query === 'string') return query;
  return new URLSearchParams(query).toString();
}

export function useGetAllProductsQuery() {
  return usePublicProducts();
}

export function useGetProductTypeQuery({ type, query } = {}) {
  return usePublicProducts(buildQuery(query));
}

export function useGetOfferProductsQuery(type) {
  const products = usePublicProducts();
  const filtered = useMemo(
    () => ({ data: (products.data?.data || []).filter((p) => p.discount > 0) }),
    [products.data]
  );

  return { ...products, data: filtered };
}

export function useGetPopularProductByTypeQuery(type) {
  return usePublicProducts('topSeller=true');
}

export function useGetTopRatedProductsQuery() {
  const products = usePublicProducts();
  const sorted = useMemo(
    () => ({ data: [...(products.data?.data || [])].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)) }),
    [products.data]
  );

  return { ...products, data: sorted };
}

export function useGetProductQuery(id) {
  const [state, setState] = useState({ data: null, isLoading: Boolean(id), isError: false });

  useEffect(() => {
    if (!id) {
      setState({ data: null, isLoading: false, isError: true });
      return undefined;
    }

    let active = true;
    setState({ data: null, isLoading: true, isError: false });

    fetch(`/api/products?id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const payload = await res.json().catch(() => null);
        if (!res.ok) throw new Error(payload?.message || 'Producto no encontrado');
        return payload;
      })
      .then((payload) => {
        if (active) setState({ data: payload, isLoading: false, isError: false });
      })
      .catch(() => {
        if (active) setState({ data: null, isLoading: false, isError: true });
      });

    return () => {
      active = false;
    };
  }, [id]);

  return state;
}

export function useGetRelatedProductsQuery(id) {
  const products = usePublicProducts();
  const related = useMemo(() => {
    const allProducts = products.data?.data || [];
    const source = allProducts.find((p) => p._id === id || p.slug === id);

    return {
      data: source
        ? allProducts.filter((p) => p.category?.name === source.category?.name && p._id !== source._id).slice(0, 4)
        : [],
    };
  }, [id, products.data]);

  return { ...products, data: related };
}
