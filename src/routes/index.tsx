import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FlaskConical,
  Microscope,
  Pill,
  HeartPulse,
  ArrowLeft,
} from "lucide-react";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { useCategories } from "@/lib/products";
import { ApiState } from "@/components/site/ApiState";
import { ApiImage } from "@/components/site/ApiImage";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "فارما كير | الرئيسية" },
      { name: "description", content: "شركة فارما كير الدوائية - منتجات صيدلانية بمعايير عالمية" },
    ],
  }),
});

const features = [
  { icon: ShieldCheck, title: "جودة GMP", desc: "تصنيع وفق المعايير الدولية للممارسات التصنيعية الجيدة." },
  { icon: FlaskConical, title: "أبحاث مستمرة", desc: "فريق بحث وتطوير لابتكار تركيبات دوائية متقدمة." },
  { icon: Microscope, title: "مخابر معتمدة", desc: "اختبارات دقيقة لكل دفعة قبل الإفراج عنها للسوق." },
  { icon: HeartPulse, title: "صحة المجتمع", desc: "نضع المريض في قلب كل قرار وكل منتج." },
];

const stats = [
  { value: "+90", label: "منتج صيدلاني" },
  { value: "20", label: "صيدلانياً من ذوي الخبرة" },
  { value: "+200", label: "كادر متخصص" },
  { value: "صناعة", label: "سورية" },
];

function HomePage() {
  const catalogue = useCategories();
  const categories = catalogue.pending || catalogue.error ? [] : catalogue.data.slice(0, 4);
  const { text, dir } = useLanguage();
  return (
    <div>
      <HeroSlideshow />

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-background p-8 shadow-soft md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="text-center"
            >
              <div className="text-4xl font-extrabold text-gradient-brand">{i === 0 ? (catalogue.pending || catalogue.error ? "—" : catalogue.products.length) : s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            لماذا <span className="text-gradient-brand">فارما كير</span>؟
          </h2>
          <p className="mt-3 text-muted-foreground">
            نصنع الفرق عبر التزام صارم بالجودة، وأبحاث متواصلة، وكوادر بشرية متميزة.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-soft"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                <f.icon size={26} />
              </div>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold md:text-4xl">
                <span className="text-gradient-brand">منتجاتنا</span> الدوائية
              </h2>
              <p className="mt-2 text-muted-foreground">دليل ذكي للأصناف الطبية بأقسام مدروسة.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
              كل المنتجات <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ApiState pending={catalogue.pending} error={catalogue.error} empty={!catalogue.data.length} retry={catalogue.retry} />
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={c.slug ? "/products/category/$slug" : "/products"}
                  params={{ slug: c.slug ?? "" }}
                  dir={dir}
                  className="group block overflow-hidden rounded-2xl border border-border bg-background shadow-soft"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary/50">
                    <ApiImage
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                      {c.count} {text('صنف', 'products')}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold text-primary">{c.tagline}</div>
                    <div className="mt-1 text-lg font-bold">{c.title}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 text-center text-primary-foreground shadow-glow md:p-16">
          <Pill className="absolute -top-6 -right-6 h-32 w-32 opacity-10" />
          <Pill className="absolute -bottom-8 -left-8 h-40 w-40 opacity-10 rotate-45" />
          <h2 className="text-3xl font-extrabold md:text-4xl">شريكك الموثوق في الصناعة الدوائية</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 md:text-base">
            تواصل مع فريقنا للحصول على معلومات المنتجات أو لفتح قنوات التوزيع والشراكة.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-primary hover:scale-105 transition-transform"
          >
            تواصل معنا <ArrowLeft size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
