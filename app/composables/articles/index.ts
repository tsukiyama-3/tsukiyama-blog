export const useTechArticles = async () => {
  const { data: articles } = await useAsyncData('blog', () =>
    queryCollection('tech')
      .where('published', '=', true)
      .select('id', 'title', 'path', 'description', 'icon', 'tags', 'date')
      .order('date', 'DESC')
      .all(),
  )

  return { articles }
}

export const useTechArticle = async (path: string) => {
  const { data: article } = await useAsyncData(path, () =>
    queryCollection('tech')
      .path(path)
      .select('id', 'title', 'description', 'ogImage', 'icon', 'tags', 'body', 'date', 'updatedAt')
      .first(), {
    default: () => null,
  })

  return { article }
}
