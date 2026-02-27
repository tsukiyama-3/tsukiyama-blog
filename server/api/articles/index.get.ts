import { getArticles } from '~~/server/domains/models/articles'

export default defineEventHandler(async (event) => {
  const articles = await getArticles(event)

  return articles
})
