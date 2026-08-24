import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowLeft, Users, GraduationCap, Heart } from "lucide-react";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
  head: () => ({
    meta: [
      { title: "الوظائف | فارما كير" },
      { name: "description", content: "انضم إلى فريق فارما كير - فرص وظيفية متعددة في الصيدلة والإدارة والتسويق." },
    ],
  }),
});

const jobs = [
  { title: "صيدلاني تصنيع", dept: "الإنتاج", location: "دمشق", type: "دوام كامل" },
  { title: "مسؤول ضبط جودة", dept: "QC", location: "دمشق", type: "دوام كامل" },
  { title: "مندوب علمي طبي", dept: "التسويق", location: "حلب · حمص", type: "دوام كامل" },
  { title: "مهندس صيانة", dept: "العمليات", location: "دمشق", type: "دوام كامل" },
];

const perks = [
  { icon: Heart, title: "تأمين صحي", text: "تغطية صحية شاملة لك ولعائلتك." },
  { icon: GraduationCap, title: "تدريب وتطوير", text: "ميزانية سنوية للدورات والمؤتمرات العلمية." },
  { icon: Users, title: "بيئة محفّزة", text: "ثقافة عمل تشاركية وفريق متعاون." },
];

function CareersPage() {
  return (
    <div>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">
            انضم إلى <span className="text-gradient-brand">عائلتنا</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            نبحث عن المواهب التي تشاركنا الشغف بالعلم والابتكار وخدمة المجتمع.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                <p.icon size={22} />
              </div>
              <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold md:text-3xl">الفرص الحالية</h2>
        <div className="mt-6 space-y-4">
          {jobs.map((j, i) => (
            <motion.div
              key={j.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col gap-4 rounded-2xl border border-border p-6 transition-colors hover:border-primary md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Briefcase size={22} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-primary">{j.dept}</div>
                  <div className="text-lg font-bold">{j.title}</div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {j.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {j.type}</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:scale-105 transition-transform">
                قدّم الآن <ArrowLeft size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
