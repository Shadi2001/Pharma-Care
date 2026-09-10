import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Youtube, Calendar, ArrowLeft } from "lucide-react";

import { useApiPage, useApiList } from '@/api/queries';
import { pageFromLink } from '@/api/client';
import { ApiState } from '@/components/site/ApiState';
import { ApiPagination } from '@/components/site/ApiPagination';
import { pageSearch } from '@/lib/pagination';
import { useLanguage } from '@/lib/language';
import { excerpt, formatDate } from '@/lib/content';

export const Route = createFileRoute("/science")({
  component: SciencePage,
  validateSearch: pageSearch,
  head: () => ({
    meta: [
      { title: "المركز العلمي | فارما كير" },
      { name: "description", content: "مقالات طبية، أخبار الوكيل، ومحاضرات مرئية من فارما كير." },
    ],
  }),
});

function SciencePage() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { lang, text, dir } = useLanguage();
  const blogs = useApiPage('blogs', page);
  const topics = useApiList('blog-topics');
  const articles = blogs.data?.results ?? [];
  const topicMap = new Map(topics.data?.map(topic => [topic.id, topic]));
  return (
    <div dir={dir}>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary">
            <BookOpen size={14} /> Scientific Hub
          </span>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
            {text('المركز', 'Scientific')} <span className="text-gradient-brand">{text('العلمي', 'hub')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {text('مقالات طبية، محاضرات مرئية، ومحتوى علمي متجدد يجعل من موقعنا مرجعاً موثوقاً للأطباء والصيادلة.', 'Medical articles, video lectures, and scientific updates for doctors and pharmacists.')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <ApiState pending={blogs.isPending} error={blogs.error} empty={!articles.length} retry={() => blogs.refetch()} />
          {topics.error && <ApiState error={topics.error} retry={() => topics.refetch()} />}
          {articles.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-border bg-background p-7 transition-shadow hover:shadow-soft"
            >
              <div className="flex items-center justify-between text-xs">
                <span title={topicMap.get(a.topic.id)?.description} className="rounded-full bg-gradient-brand px-3 py-1 font-bold text-primary-foreground">{topicMap.get(a.topic.id)?.name ?? a.topic.name}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar size={13} /> {formatDate(a.published_at, lang)}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold leading-snug">{a.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{excerpt(a.content)}</p>
              {a.slug && <Link to="/science/$slug" params={{ slug: a.slug }} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">
                {text('تابع القراءة', 'Read more')} <ArrowLeft size={14} />
              </Link>}
            </motion.article>
          ))}
        </div>

        {blogs.data && <ApiPagination page={page} previous={pageFromLink(blogs.data.previous)} next={pageFromLink(blogs.data.next)} onPage={page => navigate({ search: previous => ({ ...previous, page }) })} />}

        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-brand p-10 text-primary-foreground shadow-glow md:flex md:items-center md:justify-between md:p-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <Youtube size={14} /> قناتنا على يوتيوب
            </div>
            <h3 className="mt-4 text-2xl font-extrabold md:text-3xl">محاضرات ومحتوى مرئي حصري</h3>
            <p className="mt-2 max-w-xl text-sm opacity-90">
              تابع آخر المحاضرات الطبية والشروحات العلمية من خبراء فارما كير.
            </p>
          </div>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-primary hover:scale-105 transition-transform md:mt-0"
          >
            زيارة القناة <ArrowLeft size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
