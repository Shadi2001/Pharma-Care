import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Filter, Pill } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/lib/products";
import { ApiState } from "@/components/site/ApiState";
import { ApiImage } from "@/components/site/ApiImage";
import { ApiPagination } from "@/components/site/ApiPagination";
import { pageSearch, paginate } from "@/lib/pagination";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  validateSearch: pageSearch,
  head: () => ({
    meta: [
      { title: "المنتجات | فارما كير" },
      { name: "description", content: "دليل المنتجات الدوائية لشركة فارما كير - مضادات حيوية، أشربة، أقراص، كريمات." },
    ],
  }),
});

function ProductsPage() {
  const catalogue = useCategories();
  const categories = catalogue.pending || catalogue.error ? [] : catalogue.data;
  const { text, dir } = useLanguage();
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setPage = (page: number) => navigate({ search: previous => ({ ...previous, page }) });
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");

  const filtered = categories.filter((c) => {
      const term = q.trim().toLocaleLowerCase();
      const matchQ = !term || [c.title, c.tagline, c.description].some(value => value.toLocaleLowerCase().includes(term)) || catalogue.products.some(product => product.category.id === c.id && [product.name, product.description].some(value => value.toLocaleLowerCase().includes(term)));
      const matchC = active === "all" || c.id === active;
      return matchQ && matchC;
  });
  const pagination = paginate(filtered, page);

  return (
    <div dir={dir}>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">
            <span className="text-gradient-brand">{text('دليل المنتجات', 'Product directory')}</span> {text('الدوائية', '')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {text('أصنافنا الصيدلانية مصنّفة وفق الفئة العلاجية لتسهيل الوصول السريع للأطباء والصيادلة.', 'Browse pharmaceutical products by category for quick access.')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); void setPage(1); }}
              placeholder={text('ابحث عن منتج...', 'Search for a product...')}
              className="w-full rounded-full border border-border bg-background py-3 pr-10 pl-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <button
              onClick={() => { setActive("all"); void setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                active === "all" ? "bg-gradient-brand text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary"
              }`}
            >
              {text('الكل', 'All')}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActive(c.id); void setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  active === c.id ? "bg-gradient-brand text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ApiState pending={catalogue.pending} error={catalogue.error} empty={!filtered.length} retry={catalogue.retry} />
          {pagination.items.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
                <ApiImage src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                  <Pill size={12} /> {c.count} {text('صنف', 'products')}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-primary">{c.tagline}</div>
                <h3 className="mt-1 text-xl font-bold">{c.slug ? <Link to="/products/category/$slug" params={{ slug: c.slug }}>{c.title}</Link> : c.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{c.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
        {!catalogue.pending && !catalogue.error && <ApiPagination {...pagination} onPage={setPage} />}
      </section>
    </div>
  );
}
