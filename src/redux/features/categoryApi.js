import categoriesData from '@/data/joyerialis-categories.json';

const allCategories = categoriesData.result;

export function useGetShowCategoryQuery() {
  return { data: { result: allCategories }, isLoading: false, isError: false };
}

export function useGetProductTypeCategoryQuery(type) {
  return { data: { result: allCategories }, isLoading: false, isError: false };
}

export function useAddCategoryMutation() {
  return [() => {}, { isLoading: false }];
}
