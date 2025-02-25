import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
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
