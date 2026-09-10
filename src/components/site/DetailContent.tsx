import { motion } from 'framer-motion';
import { ApiImage } from './ApiImage';
import { contentText } from '@/lib/content';
import { useLanguage } from '@/lib/language';
import type { ReactNode } from 'react';

export function DetailContent({ title, description, image, children }: { title: string; description: string; image?: string | null; children?: ReactNode }) {
  const { dir } = useLanguage();
  return (
    <div dir={dir}>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl"><span className="text-gradient-brand">{title}</span></h1>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
          {image && <ApiImage src={image} alt={title} className="max-h-[32rem] w-full object-contain bg-secondary/50" />}
          <div className="p-7 md:p-10">
            {children}
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">{contentText(description)}</p>
          </div>
        </motion.article>
      </section>
    </div>
  );
}
