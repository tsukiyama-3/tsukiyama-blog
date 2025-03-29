import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    tech: defineCollection({
      type: "page",
      source: "tech/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        published: z.boolean(),
        date: z.date(),
        tags: z.string().array().optional(),
        updatedAt: z.date().optional(),
      }),
    }),
  },
});
