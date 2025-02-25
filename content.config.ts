import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
    tech: defineCollection({
      type: 'page',
      source: 'blog/tech/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        ogp: z.string(),
      }),
    }),
  },
})
