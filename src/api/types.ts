import { z } from "zod";

// Optional and nullable fields follow Pharma Care API.yaml, not just the demo data.
const slug = z.string().max(255).regex(/^[-a-zA-Z0-9_]*$/).optional();
const image = z.string().url().nullable().optional();
const related = z.object({ id: z.string().uuid(), slug, name: z.string() });
export const categorySchema = related.extend({
  description: z.string(), image,
  display_order: z.number().int().min(0).max(4294967295).optional(),
});
export const productSchema = categorySchema.extend({
  category: related, is_featured: z.boolean().optional(),
  meta_title: z.string(), meta_description: z.string(),
});
export const blogTopicSchema = related.extend({ description: z.string(), icon: image });
export const blogSchema = z.object({
  id: z.string().uuid(), slug, topic: related, title: z.string(), content: z.string(), image,
  published_at: z.string().datetime({ offset: true }).nullable().optional(),
});
export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    count: z.number().int().nonnegative(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(item),
  });
}
export const resourceSchemas = {
  categories: categorySchema, products: productSchema,
  'blog-topics': blogTopicSchema, blogs: blogSchema,
};
export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type BlogTopic = z.infer<typeof blogTopicSchema>;
export type Blog = z.infer<typeof blogSchema>;
export type Resource = keyof typeof resourceSchemas;
export type Resources = { categories: Category; products: Product; 'blog-topics': BlogTopic; blogs: Blog };
export type Paginated<T> = { count: number; next?: string | null; previous?: string | null; results: T[] };
export type Language = 'ar' | 'en';
