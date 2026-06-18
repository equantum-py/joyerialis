import productsData from '@/data/joyerialis-products.json';

const allProducts = productsData.data;

function applyQueryFilter(products, queryString) {
  if (!queryString) return products;
  const params = new URLSearchParams(queryString);
  let result = products;
  if (params.get('new') === 'true')        result = result.filter(p => p.new === true);
  if (params.get('topSeller') === 'true')  result = result.filter(p => p.topSeller === true);
  if (params.get('featured') === 'true')   result = result.filter(p => p.featured === true);
  return result;
}

export function useGetAllProductsQuery() {
  return { data: { data: allProducts }, isLoading: false, isError: false };
}

export function useGetProductTypeQuery({ type, query } = {}) {
  const filtered = applyQueryFilter(allProducts, query);
  return { data: { data: filtered }, isLoading: false, isError: false };
}

export function useGetOfferProductsQuery(type) {
  const filtered = allProducts.filter(p => p.discount > 0);
  return { data: { data: filtered }, isLoading: false, isError: false };
}

export function useGetPopularProductByTypeQuery(type) {
  const filtered = allProducts.filter(p => p.topSeller || p.new).slice(0, 10);
  return { data: { data: filtered }, isLoading: false, isError: false };
}

export function useGetTopRatedProductsQuery() {
  const sorted = [...allProducts].sort((a, b) => b.rating - a.rating);
  return { data: { data: sorted }, isLoading: false, isError: false };
}

export function useGetProductQuery(id) {
  const product = allProducts.find(p => p._id === id) ?? null;
  return { data: product, isLoading: false, isError: product === null };
}

export function useGetRelatedProductsQuery(id) {
  const source = allProducts.find(p => p._id === id);
  const related = source
    ? allProducts.filter(p => p.category.name === source.category.name && p._id !== id).slice(0, 4)
    : [];
  return { data: { data: related }, isLoading: false, isError: false };
}
