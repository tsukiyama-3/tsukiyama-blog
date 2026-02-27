import { z } from 'zod'
import { getArticle } from '~~/server/domains/models/articles'

const PARAMETER_SCHEMA = z.object({
  slug: z.string(),
})

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, PARAMETER_SCHEMA.parse)

  const article = await getArticle(event, slug)

  return article
})
