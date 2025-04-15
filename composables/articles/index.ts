export const useTechArticle = async (path: string) => {
  const { data: article } = await useAsyncData(path, () => queryCollection('tech').path(path).first())
  return { article }
}
