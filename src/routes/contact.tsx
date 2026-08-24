import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "تواصل معنا | فارما كير" },
      { name: "description", content: "تواصل مع فريق فارما كير للاستفسارات الطبية والشراكات التجارية." },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">
            <span className="text-gradient-brand">تواصل</span> معنا
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            فريقنا جاهز للإجابة على استفساراتكم خلال 24 ساعة عمل.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          {[
            { icon: Phone, title: "الهاتف", value: "+963 11 000 0000" },
            { icon: Mail, title: "البريد الإلكتروني", value: "info@pharmacare.com" },
            { icon: MapPin, title: "العنوان", value: "دمشق، سوريا - المنطقة الصناعية" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-2xl border border-border p-5 hover:shadow-soft transition-shadow"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                <c.icon size={22} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{c.title}</div>
                <div className="text-base font-bold">{c.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-3xl border border-border bg-background p-8 shadow-soft lg:col-span-3"
        >
          <h2 className="text-2xl font-extrabold">أرسل رسالتك</h2>
          <p className="mt-1 text-sm text-muted-foreground">سنرد عليك في أقرب وقت ممكن.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input required placeholder="الاسم الكامل" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <input required type="email" placeholder="البريد الإلكتروني" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <input placeholder="رقم الهاتف" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <input placeholder="الموضوع" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <textarea required rows={5} placeholder="رسالتك..." className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

          <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
            <Send size={16} /> إرسال
          </button>
          {sent && <p className="mt-4 text-sm font-bold text-primary">شكراً لتواصلك! سنعود إليك قريباً.</p>}
        </motion.form>
      </section>
    </div>
  );
}
