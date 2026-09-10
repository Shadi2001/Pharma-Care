import { useQuery } from '@tanstack/react-query';
import { ApiError, getAll, getDetail, getPage } from './client';
import type { Resource, Language } from './types';
import { useLanguage } from '@/lib/language';

const options = {
  staleTime: 60000,
  retry: (count: number, error: Error) => count < 1 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
};
export function useApiList<K extends Resource>(resource: K, language?: Language) {
  const current = useLanguage();
  const lang = language ?? current.lang;
  return useQuery({ ...options, queryKey: ['pharma', resource, lang, 'all'], queryFn: ({ signal }) => getAll(resource, lang, signal), enabled: typeof window !== 'undefined' });
}
export function useApiPage<K extends Resource>(resource: K, page: number) {
  const { lang } = useLanguage();
  return useQuery({ ...options, queryKey: ['pharma', resource, lang, 'page', page], queryFn: ({ signal }) => getPage(resource, lang, page, signal), enabled: typeof window !== 'undefined' });
}
export function useApiDetail<K extends Exclude<Resource, 'blog-topics'>>(resource: K, slug: string) {
  const { lang } = useLanguage();
  return useQuery({ ...options, queryKey: ['pharma', resource, lang, slug], queryFn: ({ signal }) => getDetail(resource, slug, lang, signal), enabled: typeof window !== 'undefined' });
}
