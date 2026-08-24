import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Filter, Pill } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "المنتجات | فارما كير" },
      { name: "description", content: "دليل المنتجات الدوائية لشركة فارما كير - مضادات حيوية، أشربة، أقراص، كريمات." },
    ],
  }),
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const matchQ = q === "" || c.title.includes(q) || c.tagline.toLowerCase().includes(q.toLowerCase());
      const matchC = active === "all" || c.slug === active;
      return matchQ && matchC;
    });
  }, [q, active]);

  return (
    <div>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">
            <span className="text-gradient-brand">دليل المنتجات</span> الدوائية
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            أصنافنا الصيدلانية مصنّفة وفق الفئة العلاجية لتسهيل الوصول السريع للأطباء والصيادلة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-full border border-border bg-background py-3 pr-10 pl-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                active === "all" ? "bg-gradient-brand text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary"
              }`}
            >
              الكل
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  active === c.slug ? "bg-gradient-brand text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.article
              key={c.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
                <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                  <Pill size={12} /> {c.count} صنف
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-primary">{c.tagline}</div>
                <h3 className="mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{c.description}</p>
              </div>
            </motion.article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">لا توجد نتائج مطابقة</p>
          )}
        </div>
      </section>
    </div>
  );
}
