import { createFileRoute, Link } from '@tanstack/react-router';
import { useApiDetail } from '@/api/queries';
import { ApiState } from '@/components/site/ApiState';
import { DetailContent } from '@/components/site/DetailContent';
import { useLanguage } from '@/lib/language';

export const Route = createFileRoute('/products_/$slug')({ component: ProductDetail });

function ProductDetail() {
  const { slug } = Route.useParams();
  const query = useApiDetail('products', slug);
  const { text } = useLanguage();
  const product = query.data;
  if (!product) return <div className="mx-auto max-w-7xl px-6 py-16"><ApiState pending={query.isPending} error={query.error} retry={() => query.refetch()} /></div>;
  return <>
    <title>{product.meta_title || `${product.name} | Pharma Care`}</title>
    <meta name="description" content={product.meta_description || product.description} />
    <DetailContent title={product.name} description={product.description} image={product.image}>
      <Link to="/products" className="text-sm font-bold text-primary">{text('المنتجات', 'Products')}</Link>
      <span className="mx-2 text-muted-foreground">/</span>
      {product.category.slug ? <Link to="/products/category/$slug" params={{ slug: product.category.slug }} className="text-sm font-bold text-primary">{product.category.name}</Link> : <span>{product.category.name}</span>}
      {query.error && <ApiState error={query.error} retry={() => query.refetch()} />}
    </DetailContent>
  </>;
}
