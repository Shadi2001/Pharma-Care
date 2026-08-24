import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Youtube, Calendar, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/science")({
  component: SciencePage,
  head: () => ({
    meta: [
      { title: "المركز العلمي | فارما كير" },
      { name: "description", content: "مقالات طبية، أخبار الوكيل، ومحاضرات مرئية من فارما كير." },
    ],
  }),
});

const articles = [
  {
    tag: "أبحاث",
    title: "مقاومة المضادات الحيوية: التحديات والحلول",
    excerpt: "نظرة علمية معمّقة في ظاهرة مقاومة الجراثيم وأهمية الاستخدام الرشيد للأدوية.",
    date: "2025-04-12",
  },
  {
    tag: "مقال طبي",
    title: "الأشكال الصيدلانية الحديثة وتأثيرها على الفاعلية",
    excerpt: "كيف تساهم تقنيات التحرر المتحكم به في تحسين النتائج العلاجية للمرضى.",
    date: "2025-03-28",
  },
  {
    tag: "وعي صحي",
    title: "أساسيات الاستخدام الآمن للأدوية في المنزل",
    excerpt: "إرشادات ذهبية لكل عائلة لتجنّب أخطاء استخدام وحفظ الأدوية.",
    date: "2025-03-10",
  },
  {
    tag: "أخبار الوكيل",
    title: "إطلاق خط إنتاج جديد للمضادات الحيوية الفموية",
    excerpt: "توسعة طاقتنا الإنتاجية لتلبية الطلب المتزايد في السوق المحلية والإقليمية.",
    date: "2025-02-22",
  },
];

function SciencePage() {
  return (
    <div>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary">
            <BookOpen size={14} /> Scientific Hub
          </span>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
            المركز <span className="text-gradient-brand">العلمي</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            مقالات طبية، محاضرات مرئية، ومحتوى علمي متجدد يجعل من موقعنا مرجعاً
            موثوقاً للأطباء والصيادلة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-border bg-background p-7 transition-shadow hover:shadow-soft"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-gradient-brand px-3 py-1 font-bold text-primary-foreground">{a.tag}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar size={13} /> {a.date}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold leading-snug">{a.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{a.excerpt}</p>
              <Link to="/science" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">
                تابع القراءة <ArrowLeft size={14} />
              </Link>
            </motion.article>
          ))}
        </div>

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
