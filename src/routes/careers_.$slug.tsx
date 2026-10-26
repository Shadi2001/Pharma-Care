import { createFileRoute, Link } from '@tanstack/react-router';
import { useApiDetail } from '@/api/queries';
import { ApiState } from '@/components/site/ApiState';
import { contentText, excerpt } from '@/lib/content';
import { useLanguage } from '@/lib/language';

export const Route = createFileRoute('/careers_/$slug')({ component: JobDetail });

function JobDetail() {
  const { slug } = Route.useParams();
  const query = useApiDetail('jobs', slug);
  const { text, dir } = useLanguage();
  const job = query.data;
  if (!job) return <div className="mx-auto max-w-7xl px-6 py-16"><ApiState pending={query.isPending} error={query.error} retry={() => query.refetch()} /></div>;

  return (
    <div dir={dir}>
      <title>{job.meta_title || `${job.title} | Pharma Care`}</title>
      <meta name="description" content={job.meta_description || excerpt(job.description)} />
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Link to="/careers" className="text-sm font-bold text-primary">{text('العودة إلى الوظائف', 'Back to careers')}</Link>
          <p className="mt-8 text-sm font-bold text-primary">{job.department.name}</p>
          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">{job.title}</h1>
          {job.reference_code && <p className="mt-4 text-sm text-muted-foreground">{text('الرقم المرجعي:', 'Reference:')} <bdi>{job.reference_code}</bdi></p>}
        </div>
      </section>
      <article className="mx-auto max-w-5xl px-6 py-12">
        <ApiState error={query.error} retry={() => query.refetch()} />
        <dl className="grid gap-5 rounded-2xl border border-border bg-secondary/40 p-6 sm:grid-cols-3">
          {[
            [text('الموقع', 'Location'), job.location.name],
            [text('نوع التوظيف', 'Employment type'), job.employment_type.name],
            [text('نمط العمل', 'Workplace type'), job.workplace_type.name],
          ].map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-2 font-bold">{value}</dd></div>)}
        </dl>
        <h2 className="mt-10 text-2xl font-bold">{text('الوصف الوظيفي', 'Job description')}</h2>
        <p className="mt-4 whitespace-pre-line break-words leading-8 text-muted-foreground">{contentText(job.description)}</p>
        <h2 className="mt-10 text-2xl font-bold">{text('المتطلبات', 'Requirements')}</h2>
        <p className="mt-4 whitespace-pre-line break-words leading-8 text-muted-foreground">{contentText(job.requirements)}</p>
      </article>
    </div>
  );
}
