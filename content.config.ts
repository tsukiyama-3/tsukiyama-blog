import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    tech: defineCollection({
      type: 'page',
      source: 'tech/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        ogImage: z.string().optional(),
        published: z.boolean(),
        date: z.date(),
        tags: z.string().array().optional(),
        updatedAt: z.date().optional(),
      }),
    }),
    profile: defineCollection({
      type: 'data',
      source: 'configurations/profile.json',
      schema: z.object({
        familyName: z.string(),
        givenName: z.string(),
        birthDate: z.date(),
        birthPlace: z.object({
          country: z.string(),
          prefecture: z.string(),
        }),
        bio: z.string(),
      }),
    }),
    content: defineCollection(
      // adds the robots frontmatter key to the collection
      asSitemapCollection({
        type: 'page',
        source: '**/*.md',
      }),
    ),
  },
})
