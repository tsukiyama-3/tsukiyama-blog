import type { H3Event } from 'h3'
import type { TechCollectionItem } from '@nuxt/content'
import dayjs from 'dayjs/esm'
import utc from 'dayjs/esm/plugin/utc'
import timezone from 'dayjs/esm/plugin/timezone'
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter'
import { findArticleBySlug, findArticles } from '~~/server/domains/repositories/article'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)

const TIME_ZONE = 'Asia/Tokyo'

/**
 * 記事スラッグをもとに単一の公開記事を取得する
 * @param event H3Event
 * @param slug 記事スラッグ
 * @returns 公開記事 Get
 */
export const getArticle = async (event: H3Event, slug: string) => {
  const article = await findArticleBySlug(event, slug)

  if (article === null) {
    return null
  }

  return filterPublishedArticle(article) ? article : null
}

/**
 * 公開記事の一覧を取得する
 * @param event H3Event
 * @returns 公開済み記事 List
 */
export const getArticles = async (event: H3Event) => {
  const articles = await findArticles(event)

  return articles.filter(filterPublishedArticle)
}

/**
 * 公開記事フィルター
 * @param article TechCollectionItem
 * @returns boolean
 */
const filterPublishedArticle = (article: TechCollectionItem) => {
  // 公開日時が設定されていなければ公開済みとして扱う
  if (!article.publishedAt) {
    return true
  }

  const now = dayjs().tz(TIME_ZONE)
  const publishedAt = dayjs.tz(
    article.publishedAt,
    TIME_ZONE,
  )

  // publishedAt が現在時刻以降か判定する
  return now.isSameOrAfter(publishedAt)
}
