import { useSearch } from '@tanstack/react-router';
import type { Language } from '@/api/types';

export function languageSearch(search: Record<string, unknown>): { lang?: Language } {
  return search.lang === 'en' || search.lang === 'ar' ? { lang: search.lang } : {};
}
export function useLanguage() {
  const search = useSearch({ strict: false }) as { lang?: Language };
  const lang: Language = search.lang === 'en' ? 'en' : 'ar';
  return { lang, dir: lang === 'ar' ? 'rtl' as const : 'ltr' as const, text: (ar: string, en: string) => lang === 'ar' ? ar : en };
}
