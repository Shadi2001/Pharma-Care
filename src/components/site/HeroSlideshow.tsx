import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import slide1 from "@/assets/slide 1.png";
import slide2 from "@/assets/slide 2.png";
import slide3 from "@/assets/slide 3.png";

const slides = [
  { src: slide1, alt: "مبنى شركة فارما كير" },
  { src: slide2, alt: "بهو الاستقبال في فارما كير" },
  { src: slide3, alt: "شعار فارما كير داخل الشركة" },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused || hovered || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, reducedMotion, active]);

  const select = (index: number) => {
    setActive((index + slides.length) % slides.length);
    setPaused(true);
  };
  const control = "grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--brand-navy)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <section
      dir="rtl"
      aria-label="صور شركة فارما كير"
      aria-roledescription="عرض شرائح"
      className="relative isolate flex min-h-[620px] items-end overflow-hidden bg-[var(--brand-navy)] text-white md:min-h-[680px] md:h-[calc(100svh-5rem)] md:max-h-[900px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      {slides.map((slide, index) => (
        <div key={slide.src} aria-hidden={active !== index} className={`absolute inset-0 -z-20 transition-opacity duration-1000 motion-reduce:transition-none ${active === index ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.src} alt={slide.alt} width={1672} height={941} fetchPriority={index === 0 ? "high" : "low"} decoding="async" className="h-full w-full object-cover object-center" />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,46,109,0.95)_0%,rgba(0,46,109,0.7)_35%,rgba(0,46,109,0.08)_75%)]" />
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-48 md:pb-10">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold tracking-wide text-white/90">فارما كير · PHARMA CARE</p>
          <h1 className="text-4xl font-extrabold leading-[1.4] drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl">
            نرتقي بالمعايير <span className="block">لنرتقي بالحياة</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/90">خبرة علمية ومعايير عالية، من قلب منشآتنا إلى حياة أكثر صحة.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-turquoise)]">استعرض المنتجات <ArrowLeft size={18} /></Link>
            <Link to="/about" className="inline-flex min-h-12 items-center rounded-full border border-white/50 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15">تعرّف علينا</Link>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/25 pt-5">
          <div className="flex items-center gap-2" aria-label="اختيار الصورة">
            {slides.map((slide, index) => (
              <button key={slide.src} type="button" onClick={() => select(index)} aria-label={`عرض الصورة ${index + 1}: ${slide.alt}`} aria-pressed={active === index} className="grid h-11 min-w-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
                <span className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${active === index ? "w-10 bg-white" : "w-4 bg-white/45"}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={control} aria-label="الصورة السابقة" onClick={() => select(active - 1)}><ChevronRight size={20} /></button>
            <button type="button" className={control} aria-label="الصورة التالية" onClick={() => select(active + 1)}><ChevronLeft size={20} /></button>
            {!reducedMotion && <button type="button" className={control} aria-label={paused ? "تشغيل العرض التلقائي" : "إيقاف العرض التلقائي"} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
