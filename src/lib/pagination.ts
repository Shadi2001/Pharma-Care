import type { SearchSchemaInput } from '@tanstack/react-router';

export function pageSearch(search: Record<string, unknown> & SearchSchemaInput) {
  const value = Number(search.page);
  return { page: Number.isSafeInteger(value) && value > 0 ? value : 1 };
}
export function paginate<T>(items: T[], requestedPage: number, size = 6) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(requestedPage, pages);
  return { items: items.slice((page - 1) * size, page * size), page, previous: page > 1 ? page - 1 : undefined, next: page < pages ? page + 1 : undefined };
}
