export const useTechArticles = async () => {
  const { data: articles } = await useAsyncData('blog', () =>
    queryCollection('tech')
      .where('published', '=', true)
      .order('date', 'DESC')
      .all(),
  )
  return { articles }
}

export const useTechArticle = async (path: string) => {
  const { data: article } = await useAsyncData(path, () => queryCollection('tech').path(path).first())
  return { article }
}
