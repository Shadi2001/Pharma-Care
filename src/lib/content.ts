import type { Language } from '@/api/types';

// The schema defines plain strings, not trusted HTML. Render as React text.
// The seed API also contains literal backslash-n sequences.
export function contentText(value: string) { return value.replace(/\\n/g, '\n'); }
export function excerpt(value: string, limit = 180) {
  const text = contentText(value).replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}
export function formatDate(value: string | null | undefined, lang: Language) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(lang, { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Damascus' }).format(date);
}
