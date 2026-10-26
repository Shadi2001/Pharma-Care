import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApiList } from "@/api/queries";
import { ApiState } from "@/components/site/ApiState";
import { ApiPagination } from "@/components/site/ApiPagination";
import { useLanguage } from "@/lib/language";
import { pageSearch, paginate } from "@/lib/pagination";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowLeft, Users, GraduationCap, Heart } from "lucide-react";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
  validateSearch: pageSearch,
  head: () => ({
    meta: [
      { title: "الوظائف | فارما كير" },
      { name: "description", content: "انضم إلى فريق فارما كير - فرص وظيفية متعددة في الصيدلة والإدارة والتسويق." },
    ],
  }),
});

const perks = [
  { icon: Heart, title: "تأمين صحي", text: "تغطية صحية شاملة لك ولعائلتك." },
  { icon: GraduationCap, title: "تدريب وتطوير", text: "ميزانية سنوية للدورات والمؤتمرات العلمية." },
  { icon: Users, title: "بيئة محفّزة", text: "ثقافة عمل تشاركية وفريق متعاون." },
];

function CareersPage() {
  const jobs = useApiList('jobs');
  const departments = useApiList('job-departments');
  const { text, dir } = useLanguage();
  const [department, setDepartment] = useState('');
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setPage = (page: number) => navigate({ search: (prev) => ({ ...prev, page }) });
  const filtered = (jobs.data ?? []).filter(job => !department || job.department.id === department);
  const results = paginate(filtered, page);
  const departmentMap = new Map(departments.data?.map(item => [item.id, item.name]));
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

        <h2 dir={dir} className="mt-16 text-2xl font-extrabold md:text-3xl">{text('الفرص الحالية', 'Current opportunities')}</h2>
        <div dir={dir} className="mt-6">
          <label htmlFor="job-department" className="mb-2 block text-sm font-bold">{text('القسم', 'Department')}</label>
          <select id="job-department" value={department} onChange={event => { setDepartment(event.target.value); void setPage(1); }} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm sm:w-72">
            <option value="">{text('جميع الأقسام', 'All departments')}</option>
            {(departments.data ?? []).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          {departments.error && <ApiState error={departments.error} retry={() => departments.refetch()} />}
        </div>
        <ApiState pending={jobs.isPending} error={jobs.error} retry={() => jobs.refetch()} />
        {!jobs.isPending && !jobs.error && !filtered.length && <p dir={dir} role="status" className="py-10 text-center text-muted-foreground">{department ? text('لا توجد وظائف متاحة في هذا القسم حالياً.', 'No openings in this department right now.') : text('لا توجد وظائف متاحة حالياً. تابعنا للاطلاع على الفرص القادمة.', 'No openings right now. Check back for upcoming opportunities.')}</p>}
        <div dir={dir} className="mt-6 space-y-4">
          {results.items.map((j, i) => (
            <motion.div
              key={j.id}
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
                  <div className="text-xs font-semibold text-primary">{departmentMap.get(j.department.id) ?? j.department.name}</div>
                  <div className="text-lg font-bold">{j.title}</div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {j.location.name}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {j.employment_type.name}</span>
                    <span>{j.workplace_type.name}</span>
                    {j.reference_code && <span><bdi>{j.reference_code}</bdi></span>}
                  </div>
                </div>
              </div>
              {j.slug && <Link to="/careers/$slug" params={{ slug: j.slug }} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:scale-105 transition-transform">
                {text('عرض التفاصيل', 'View details')} <ArrowLeft size={14} />
              </Link>}
            </motion.div>
          ))}
        </div>
        {!jobs.isPending && !jobs.error && <ApiPagination {...results} onPage={setPage} />}
      </section>
    </div>
  );
}
