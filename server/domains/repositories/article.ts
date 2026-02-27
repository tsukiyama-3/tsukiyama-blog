import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'

export const findArticleBySlug = async (event: H3Event, slug: string) => {
  const article = await queryCollection<'tech'>(event, 'tech')
    .path(`/tech/${slug}`)
    .first()

  return article
}

export const findArticles = async (event: H3Event) => {
  const articles = await queryCollection<'tech'>(event, 'tech')
    .order('date', 'DESC')
    .all()

  return articles
}
