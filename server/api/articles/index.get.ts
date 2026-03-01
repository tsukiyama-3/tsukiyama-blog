import { getArticles } from '~~/server/domains/models/article'

export default defineEventHandler(async (event) => {
  const articles = await getArticles(event)

  return articles
})
