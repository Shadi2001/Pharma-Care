import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FlaskConical,
  Microscope,
  Pill,
  HeartPulse,
  Award,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import heroImg from "@/assets/hero-lab.jpg";
import { categories } from "@/lib/products";

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
  { value: "+15", label: "سنة خبرة" },
  { value: "+200", label: "كادر متخصص" },
  { value: "12", label: "دولة تصدير" },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="pointer-events-none absolute -top-32 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary">
              <Sparkles size={14} /> Pharma Health Care
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              صحة <span className="text-gradient-brand">موثوقة</span>
              <br />
              تبدأ من المختبر إلى يديك
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              نُصنّع مستحضرات صيدلانية عالية الجودة بمعايير عالمية، تجمع بين
              الخبرة العلمية والابتكار التكنولوجي لخدمة الأطباء والصيادلة
              والمرضى في كل مكان.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                استعرض المنتجات <ArrowLeft size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-bold text-foreground hover:border-primary hover:text-primary"
              >
                تعرّف علينا
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-brand opacity-20 blur-2xl" />
            <img
              src={heroImg}
              alt="مختبر فارما كير"
              width={1600}
              height={1024}
              className="relative w-full rounded-3xl object-cover shadow-soft"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background p-4 shadow-soft md:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <Award size={22} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">شهادة معتمدة</div>
                  <div className="text-sm font-bold">ISO 9001 · GMP</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
              <div className="text-4xl font-extrabold text-gradient-brand">{s.value}</div>
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
            {categories.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to="/products"
                  className="group block overflow-hidden rounded-2xl border border-border bg-background shadow-soft"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary/50">
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                      {c.count} صنف
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
