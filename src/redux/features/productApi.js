import { useEffect, useMemo, useState } from 'react';

const EMPTY_RESPONSE = { data: [] };
const PRODUCT_PLACEHOLDER = '/assets/img/product/product-placeholder.svg';

function normalizeProduct(product) {
  if (!product) return null;

  const categoryName = product.category?.name || product.categoryName || product.parent || 'General';
  const brandName = product.brand?.name || product.brandName || 'Joyerialis';
  const img = product.img || PRODUCT_PLACEHOLDER;
  const gallery = Array.isArray(product.images) ? product.images : [];
  const imageURLs = Array.isArray(product.imageURLs) && product.imageURLs.length
    ? product.imageURLs
    : [
        { img, url: img, alt: product.title || 'Producto', sortOrder: -1 },
        ...gallery.map((image, index) => ({
          ...image,
          img: image.img || image.url || PRODUCT_PLACEHOLDER,
          url: image.url || image.img || PRODUCT_PLACEHOLDER,
          sortOrder: image.sortOrder ?? index,
        })),
      ];

  return {
    ...product,
    _id: product._id || product.id || product.slug,
    id: product.id || product._id || product.slug,
    img,
    imageURLs: imageURLs.map((image) => ({
      ...image,
      img: image.img || image.url || PRODUCT_PLACEHOLDER,
      url: image.url || image.img || PRODUCT_PLACEHOLDER,
    })),
    images: gallery.map((image) => ({
      ...image,
      img: image.img || image.url || PRODUCT_PLACEHOLDER,
      url: image.url || image.img || PRODUCT_PLACEHOLDER,
    })),
    variants: Array.isArray(product.variants) ? product.variants : [],
    tags: Array.isArray(product.tags) ? product.tags : [categoryName],
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    additionalInformation: Array.isArray(product.additionalInformation) ? product.additionalInformation : [],
    category: {
      name: categoryName,
      slug: product.category?.slug || product.categorySlug || String(categoryName).toLowerCase().replace(/\s+/g, '-'),
    },
    brand: {
      name: brandName,
      slug: product.brand?.slug || product.brandSlug || String(brandName).toLowerCase().replace(/\s+/g, '-'),
    },
    description: product.description || '',
    price: Number(product.price || 0),
    discount: Number(product.discount || 0),
    status: product.status || 'in-stock',
  };
}

function normalizeProductResponse(payload) {
  return { data: (payload?.data || []).map(normalizeProduct).filter(Boolean) };
}

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
        if (active) setState({ data: normalizeProductResponse(payload), isLoading: false, isError: false });
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
        if (active) setState({ data: normalizeProduct(payload), isLoading: false, isError: false });
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
