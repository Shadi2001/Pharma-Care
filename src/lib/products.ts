import { useApiList } from '@/api/queries';

export function useCategories() {
  const categories = useApiList('categories');
  const english = useApiList('categories', 'en');
  const products = useApiList('products');
  const counts = new Map<string, number>();
  products.data?.forEach(product => counts.set(product.category.id, (counts.get(product.category.id) ?? 0) + 1));
  const names = new Map(english.data?.map(category => [category.id, category.name]));
  return {
    data: [...(categories.data ?? [])].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).map(category => ({
      ...category, title: category.name, tagline: names.get(category.id) ?? category.name,
      count: counts.get(category.id) ?? 0,
    })),
    products: products.data ?? [],
    pending: categories.isPending || products.isPending || english.isPending,
    error: categories.error || products.error || english.error,
    retry: () => Promise.all([categories.refetch(), products.refetch(), english.refetch()]),
  };
}
