import antibiotics from "@/assets/product-antibiotics.jpg";
import syrups from "@/assets/product-syrups.jpg";
import tablets from "@/assets/product-tablets.jpg";
import creams from "@/assets/product-creams.jpg";

export type ProductCategory = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  count: number;
};

export const categories: ProductCategory[] = [
  {
    slug: "antibiotics",
    title: "المضادات الحيوية",
    tagline: "Antibiotics",
    description: "قسم مخصص للمضادات الحيوية بأشكال صيدلانية متعددة وفق أعلى معايير الجودة العالمية.",
    image: antibiotics,
    count: 24,
  },
  {
    slug: "syrups",
    title: "الأشربة الدوائية",
    tagline: "Syrups & Suspensions",
    description: "تركيبات سائلة دقيقة الجرعة للأطفال والبالغين بمذاقات مقبولة وتأثير سريع.",
    image: syrups,
    count: 18,
  },
  {
    slug: "tablets",
    title: "الأقراص والكبسولات",
    tagline: "Tablets & Capsules",
    description: "أقراص مغلفة وكبسولات بتقنيات تحرر متقدمة لضمان الفاعلية القصوى.",
    image: tablets,
    count: 36,
  },
  {
    slug: "creams",
    title: "الكريمات والمراهم",
    tagline: "Topicals",
    description: "مستحضرات موضعية مدروسة الصياغة لعلاج فعّال وآمن للبشرة والجلد.",
    image: creams,
    count: 14,
  },
];
