import { createFileRoute, Link } from '@tanstack/react-router';
import { useApiDetail, useApiList } from '@/api/queries';
import { ApiState } from '@/components/site/ApiState';
import { ApiImage } from '@/components/site/ApiImage';
import { DetailContent } from '@/components/site/DetailContent';
import { useLanguage } from '@/lib/language';
import { excerpt, formatDate } from '@/lib/content';

export const Route = createFileRoute('/science_/$slug')({ component: BlogDetail });

function BlogDetail() {
  const { slug } = Route.useParams();
  const query = useApiDetail('blogs', slug);
  const topics = useApiList('blog-topics');
  const { lang, text } = useLanguage();
  const blog = query.data;
  if (!blog) return <div className="mx-auto max-w-7xl px-6 py-16"><ApiState pending={query.isPending} error={query.error} retry={() => query.refetch()} /></div>;
  const topic = topics.data?.find(topic => topic.id === blog.topic.id);
  return <>
    <title>{blog.title} | Pharma Care</title>
    <meta name="description" content={excerpt(blog.content)} />
    <DetailContent title={blog.title} description={blog.content} image={blog.image}>
      <Link to="/science" className="text-sm font-bold text-primary">{text('المركز العلمي', 'Scientific hub')}</Link>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {topic?.icon && <ApiImage src={topic.icon} alt={topic.name} className="h-8 w-8 rounded-full object-cover" />}
        <span title={topic?.description} className="rounded-full bg-gradient-brand px-3 py-1 font-bold text-primary-foreground">{topic?.name ?? blog.topic.name}</span>
        {blog.published_at && <time dateTime={blog.published_at}>{formatDate(blog.published_at, lang)}</time>}
      </div>
      {query.error && <ApiState error={query.error} retry={() => query.refetch()} />}
      {topics.error && <ApiState error={topics.error} retry={() => topics.refetch()} />}
    </DetailContent>
  </>;
}
