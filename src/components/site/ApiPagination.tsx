import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { useLanguage } from '@/lib/language';

export function ApiPagination({ page, previous, next, onPage }: { page: number; previous?: number; next?: number; onPage: (page: number) => void }) {
  const { text, dir } = useLanguage();
  if (previous === undefined && next === undefined) return null;
  return (
    <Pagination dir={dir} aria-label={text('صفحات النتائج', 'Result pages')} className="mt-8">
      <PaginationContent>
        <PaginationItem><button type="button" disabled={previous === undefined} onClick={() => previous !== undefined && onPage(previous)} className="rounded-full border border-border px-4 py-2 text-sm font-bold text-primary disabled:opacity-40">{text('السابق', 'Previous')}</button></PaginationItem>
        <PaginationItem><span aria-current="page" className="px-4 text-sm">{page}</span></PaginationItem>
        <PaginationItem><button type="button" disabled={next === undefined} onClick={() => next !== undefined && onPage(next)} className="rounded-full border border-border px-4 py-2 text-sm font-bold text-primary disabled:opacity-40">{text('التالي', 'Next')}</button></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
