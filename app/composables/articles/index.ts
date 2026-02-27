import type { TechCollectionItem } from '@nuxt/content'

export const useTechArticles = async () => {
  const { data: articles } = await useFetch('/api/articles', {
    default: (): TechCollectionItem[] => [],
  })

  return { articles }
}

export const useTechArticle = async (path: string) => {
  const { data: article } = await useFetch<TechCollectionItem | null>(`/api/articles/${path}`, {
    default: () => null,
  })

  return { article }
}
