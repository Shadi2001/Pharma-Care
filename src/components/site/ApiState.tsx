import { ApiError } from '@/api/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/lib/language';

export function ApiState({ pending, error, empty, retry }: { pending?: boolean; error?: Error | null; empty?: boolean; retry?: () => unknown }) {
  const { text, dir } = useLanguage();
  if (error) return (
    <div dir={dir} role="alert" className="col-span-full py-8 text-center text-muted-foreground">
      <p>{error instanceof ApiError && error.status === 404 ? text('لم يتم العثور على المحتوى المطلوب.', 'The requested content was not found.') : text('تعذّر تحميل البيانات. يرجى المحاولة مجدداً.', 'Unable to load data. Please try again.')}</p>
      {retry && <button type="button" onClick={retry} className="mt-4 rounded-full border border-border px-5 py-2 text-sm font-bold text-primary">{text('إعادة المحاولة', 'Try again')}</button>}
    </div>
  );
  if (pending) return (
    <div dir={dir} role="status" className="col-span-full space-y-4 py-8">
      <span className="sr-only">{text('جارٍ التحميل...', 'Loading...')}</span>
      <Skeleton className="h-40 w-full rounded-3xl" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
  return empty ? <p dir={dir} role="status" className="col-span-full text-center text-muted-foreground">{text('لا توجد نتائج مطابقة', 'No matching results')}</p> : null;
}
