export const useDiaryArticles = async () => {
  const { data: articles } = await useAsyncData('diary-blog', () =>
    queryCollection('diary')
      .order('date', 'DESC')
      .all(),
  )

  const totalDistance = computed(() => {
    if (!articles.value) {
      return 0
    }
    return articles.value.reduce((sum, article) => sum + (article.distance ?? 0), 0)
  })

  const localTime = computed(() => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: articles.value ? articles.value[0].timezone : 'UTC',
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  const localOffset = computed(() => {
    if (!articles.value?.[0]?.timezone) return 'UTC'

    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: articles.value[0].timezone,
      timeZoneName: 'shortOffset', // Chrome 104+ 必須
    })

    const parts = dtf.formatToParts(new Date())
    const offsetPart = parts.find(p => p.type === 'timeZoneName')
    return (offsetPart?.value || 'UTC').replace('GMT', 'UTC')
  })

  return { articles, totalDistance, localTime, localOffset }
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
