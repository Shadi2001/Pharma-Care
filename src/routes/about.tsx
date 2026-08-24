import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Gem, Users } from "lucide-react";
import team from "@/assets/team.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "من نحن | فارما كير" },
      { name: "description", content: "تعرّف على رؤية ورسالة وقيم شركة فارما كير الدوائية." },
    ],
  }),
});

const values = [
  { icon: Target, title: "رسالتنا", text: "تقديم أدوية آمنة وفعّالة بأسعار في متناول الجميع، مع التزام كامل بمعايير الجودة العالمية." },
  { icon: Eye, title: "رؤيتنا", text: "أن نكون الشركة الدوائية الرائدة إقليمياً في الابتكار والثقة العلمية." },
  { icon: Gem, title: "قيمنا", text: "النزاهة، الجودة، الشفافية، والابتكار المستمر في خدمة المريض." },
  { icon: Users, title: "فريقنا", text: "نخبة من الصيادلة والباحثين والكوادر الإدارية ذوي الخبرة الطويلة." },
];

function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold md:text-6xl"
          >
            من نحن في <span className="text-gradient-brand">فارما كير</span>
          </motion.h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground md:text-lg leading-8">
            شركة دوائية ناشئة بطموحات كبيرة، تأسست لتقديم منتجات صيدلانية تجمع
            بين العلم والثقة، وتعتمد على فريق من المتخصصين والباحثين في مختلف
            مجالات الصيدلة والطب.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            src={team}
            alt="فريق فارما كير"
            loading="lazy"
            width={1600}
            height={900}
            className="rounded-3xl shadow-soft"
          />
          <div>
            <h2 className="text-3xl font-extrabold">قصتنا</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              انطلقت فارما كير من إيمان عميق بأن صناعة الدواء ليست مجرد عملية
              إنتاج، بل مسؤولية إنسانية تتعلق بصحة الناس وحياتهم. منذ تأسيسنا
              ونحن نستثمر في أحدث التقنيات وفي كوادرنا البشرية لنقدّم منتجات
              تستحق الثقة.
            </p>
            <p className="mt-4 leading-8 text-muted-foreground">
              نحن اليوم نوسّع آفاقنا لنكون شريكاً موثوقاً للأطباء والصيادلة
              والموزعين، ونعمل على تطوير دليل دوائي ذكي يخدم القطاع الصحي.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border p-6 hover:shadow-soft transition-shadow"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground">
                <v.icon size={26} />
              </div>
              <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
