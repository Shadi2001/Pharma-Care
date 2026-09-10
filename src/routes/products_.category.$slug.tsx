import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useApiDetail, useApiList } from '@/api/queries';
import { ApiState } from '@/components/site/ApiState';
import { ApiImage } from '@/components/site/ApiImage';
import { ApiPagination } from '@/components/site/ApiPagination';
import { DetailContent } from '@/components/site/DetailContent';
import { useLanguage } from '@/lib/language';
import { pageSearch, paginate } from '@/lib/pagination';

export const Route = createFileRoute('/products_/category/$slug')({ component: CategoryDetail, validateSearch: pageSearch });

function CategoryDetail() {
  const { slug } = Route.useParams();
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { text, dir } = useLanguage();
  const category = useApiDetail('categories', slug);
  const products = useApiList('products');
  const filtered = (products.data ?? []).filter(product => product.category.id === category.data?.id).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const pagination = paginate(filtered, page);
  if (!category.data) return <div className="mx-auto max-w-7xl px-6 py-16"><ApiState pending={category.isPending} error={category.error} retry={() => category.refetch()} /></div>;
  return <div dir={dir}>
    <title>{category.data.name} | Pharma Care</title>
    <meta name="description" content={category.data.description} />
    <DetailContent title={category.data.name} description={category.data.description} image={category.data.image}>
      <Link to="/products" className="text-sm font-bold text-primary">{text('كل المنتجات', 'All products')}</Link>
      {category.error && <ApiState error={category.error} retry={() => category.refetch()} />}
    </DetailContent>
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <h2 className="text-3xl font-extrabold">{text('المنتجات', 'Products')}</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ApiState pending={products.isPending} error={products.error} empty={!filtered.length} retry={() => products.refetch()} />
        {pagination.items.map((product, i) => <motion.article key={product.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -8 }} className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50"><ApiImage src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" /></div>
          <div className="p-6">
            <div className="text-xs font-semibold text-primary">{product.category.name}</div>
            <h3 className="mt-1 text-xl font-bold">{product.slug ? <Link to="/products/$slug" params={{ slug: product.slug }}>{product.name}</Link> : product.name}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{product.description}</p>
          </div>
        </motion.article>)}
      </div>
      <ApiPagination {...pagination} onPage={page => navigate({ search: previous => ({ ...previous, page }) })} />
    </section>
  </div>;
}
