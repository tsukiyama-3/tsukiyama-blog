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

export const useDiarySrroundArticles = async (path: string) => {
  const { data: surrounds } = await useAsyncData(`${path}-surround`, () => {
    return queryCollectionItemSurroundings('diary', path, {
      fields: ['description', 'day'],
    })
  })

  return { surrounds }
}
