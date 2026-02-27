---
title: Nuxt Content で作ったブログの予約投稿を実装する
description: 予約投稿、それは希望。未来を信じるもののみに許された「祈り」「願い」「誓い」。僕はそれを実装しようと思う。
icon: /avatar_bwg8e2.webp
tags: ["Nuxt.js", "Nuxt Content", "Day.js"]
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1745236671/tsukiyama-blog/geo-location-api/geo-location-api_dwk5a7.png
published: false
date: 2026-03-02
publishedAt: 2026-03-02 08:00
---

## Intro

「おい、今年立てた目標はなんだったか覚えているか？」

「覚えています。技術記事を週一ペースで更新することです...。」

「この記事は何本目だ？」

「...一本目です。」

「もう2月も終わるぞ？そもそも君は去年もそのような目標を立ててなかったか？」

「...はい。」<br>
「今年こそはやり遂げようと思ってたんですが、年始から仕事やプライベートでバタバタしていまして、気がついたらこんな時期まで何も記事を書けていませんでした...。」

師匠はため息をついた

「そうやって言い訳ばかり上手くなって。そんなんじゃいつになっても技術力が上がらないままだぞ。」

「...はい。おっしゃる通りです。」

「やれ」

「yes sir.」

## 全体像・方針

表題の通り本記事では、Nuxt Content で作ったブログに予約投稿機能を実装していきます。

まずは全体像から。

### ディレクトリ構造

ディレクトリ構成と、それぞれの責務です。

```
root/
├ app
│ ├ composables
│ │ └ article
│ │   └ index.ts
│ └ pages
│   └ [slug]
│     └ index.vue
├ content
│ └ blog
│   └ **.md
├ server
│ ├ api
│ │ └ articles
│ │   ├ [slug]
│ │   │ └ index.get.ts
│ │   └ index.get.ts
│ └ domains
│   ├ models
│   │ └ article
│   │   └ index.ts
│   └ repositories
│     └ article
│       └ index.ts
└ content.config.ts
```

### 方針

ディレクトリ構造から自明ですが、DDDに沿って実装していきます。

また、時刻を扱うためクライアントではなくサーバー側で記事をフィルターしていきます。

「Nuxt Content のデータを Nuxt Server にて現在時刻をみてフィルターし、それを Composables で取得して利用する」という流れで進めていきます。

## Schema

```ts [content.config.ts]
```

## Nuxt Server

### UseCase

```ts [~~/server/domains/models/article/index.ts]
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

export const getArticle = async (event: H3Event, slug: string) => {
  const article = await findArticleBySlug(event, slug)

  if (article === null) {
    return null
  }

  return filterPublishedArticle(article) ? article : null
}

/**
 * @param event H3Event
 * @returns 公開済み記事 List
 */
export const getArticles = async (event: H3Event) => {
  const articles = await findArticles(event)

  return articles.filter(filterPublishedArticle)
}

const filterPublishedArticle = (article: TechCollectionItem) => {
  // 公開日時が設定されていなければ公開済みとして扱う
  if (!article.publishedAt) {
    return true
  }

  const now = dayjs().tz(TIME_ZONE)

  return now.isSameOrAfter(dayjs(article.publishedAt).tz(TIME_ZONE))
}

```

### Repository

Repository では、外部リソース（今回は Nuxt Content）からのデータアクセスを抽象化します。

```ts [~~/server/domains/repositories/article.ts]
import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'

export const findArticleBySlug = async (event: H3Event, slug: string) => {
  const article = await queryCollection<'tech'>(event, 'tech')
    .path(`/tech/${slug}`)
    .first()

  return article
}

export const findArticles = async (event: H3Event) => {
  const articles = await queryCollection<'tech'>(event, 'tech')
    .order('date', 'DESC')
    .all()

  return articles
}
```

### API Handler

一覧と詳細用に List と Get API ハンドラーを用意します。

#### List API

```ts [~~/server/api/articles/index.get.ts]
import { getArticles } from '~~/server/domains/models/articles'

export default defineEventHandler(async (event) => {
  const articles = await getArticles(event)

  return articles
})
```

#### Get API

```ts [~~/server/api/articles/[slug]/index.get.ts]
import { z } from 'zod'
import { getArticle } from '~~/server/domains/models/articles'

const PARAMETER_SCHEMA = z.object({
  slug: z.string(),
})

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, PARAMETER_SCHEMA.parse)

  const article = await getArticle(event, slug)

  return article
})
```

## Composables

```ts [~/app/composables/articles/index.ts]
import type { TechCollectionItem } from '@nuxt/content'

export const useTechArticles = async () => {
  const { data: articles } = await useFetch('/api/articles', {
    default: (): TechCollectionItem[] => [],
  })

  return { articles }
}

export const useTechArticle = async (path: string) => {
  const { data: article } = await useFetch<TechCollectionItem | null>(`/api/articles/${path}`,
    {
      default: () => null,
    }
  )

  return { article }
}
```

## Template

Composables を呼ぶだけですが、一応テンプレートです。

```vue [~/app/pages/index.vue]
<scritp setup lang="ts">
const { articles } = await useArticles()
</scritp>

<template>
  <!-- 割愛します -->
</template>
```

```vue [~/app/pages/[slug]/index.vue]
<scritp setup lang="ts">
const route = useRoute()
const slug = route.params.slug
const { article } = await useArticle(slug)

if (article === null) {
  throw createError({ statusCode: 404, message: 'Article Not Found.' })
}
</scritp>

<template>
  <!-- 割愛します -->
</template>
```

## Outro


