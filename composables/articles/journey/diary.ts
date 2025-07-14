export const useDiaryArticles = async () => {
  const { data: articles } = await useAsyncData('blog', () =>
    queryCollection('diary')
      .order('date', 'DESC')
      .all(),
  )

  return { articles }
}

export const useDiaryArticle = async (path: string) => {
  const { data: article } = await useAsyncData(path, () => queryCollection('diary').path(path).first(), {
    default: () => null,
  })

  return { article }
}
