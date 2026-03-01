---
title: Nuxt Content で作ったブログの予約投稿を実装する
description: 予約投稿、それは希望。未来を信じるもののみに許された「祈り」「願い」「誓い」。僕はそれを実装しようと思う。
icon: /avatar_bwg8e2.webp
tags: ["Nuxt.js", "Nuxt Content", "Day.js"]
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1745236671/tsukiyama-blog/geo-location-api/geo-location-api_dwk5a7.png
published: true
date: 2026-03-01
publishedAt: 2026-03-01 21:38
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

## Overview

表題の通り本記事では、Nuxt Content で作ったブログに予約投稿機能を実装していきます。

Nuxt Content でのブログ作成については以下の記事をご覧ください。

::callout{icon="ic:baseline-article" color="primary" to="/tech/nuxt-content-v3-blog"}
Nuxt Content v3 + Nuxt Hub を使って爆速で個人ブログを作って公開する
::

まずは全体像から。

### ディレクトリ構造

ディレクトリ構成と、それぞれの責務です。

```
root/
├ app
│ ├ composables // フロント プレゼン層
│ │ └ article
│ │   └ index.ts
│ └ pages
│   └ [slug]
│     └ index.vue
├ content // Contents 記事を管理する
│ └ articles
│   └ *.md
├ server 
│ ├ api // HTTP プレゼン層
│ │ └ articles
│ │   ├ [slug]
│ │   │ └ index.get.ts // 記事詳細取得
│ │   └ index.get.ts // 記事一覧取得
│ └ domains
│   ├ models // ドメイン層（Articleの概念）
│   │ └ article
│   │   └ index.ts
│   └ repositories // レポジトリ層（データアクセスを抽象化する）
│     └ article
│       └ index.ts
└ content.config.ts
```

### 方針

ディレクトリ構造から自明ですが、DDDに沿って実装していきます。

また、時刻を扱うためクライアントではなくサーバー側で記事をフィルターしていきます。

「**Nuxt Content のデータを Nuxt Server にて現在時刻をみてフィルターし、それを Composables で取得して利用する**」という流れで進めていきます。

## Collection

まずは `content.config` のコレクション定義から

```ts [content.config.ts]
export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        publishedAt: z.date().optional(), // 予約投稿はこの項目の設定日時を見る
      })
    })
  }
})
```

`publishedAt` はオプショナルにしました（既存の公開済みの記事全てに `publishedAt` を、設定するのは面倒だったので）が、その辺は都合の良いように設定してください。

---

次にテスト用に何記事か追加していきます。

```md [~~/content/articles/hoge.md]
---
title: 公開済みテスト記事
descritption: 公開済みのテスト記事です
date: 2026-03-01
publishedAt: 2026-03-01 08:00
---

公開済みテスト記事です

```

```md [~~/content/articles/fuga.md]
---
title: 公開前テスト記事
descritption: 公開前のテスト記事です
date: 2026-03-02
publishedAt: 2026-03-02 08:00
---

公開前テスト記事です。
```

## Nuxt Server

サーバー側にて Nuxt Content からを記事取得し、公開済み記事をフィルターしていきます。

### Repository

Repository では、外部リソース（今回は Nuxt Content）からのデータアクセスを抽象化します。

```ts [~~/server/domains/repositories/article/index.ts]
import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'

export const findArticleBySlug = async (event: H3Event, slug: string) => {
  const article = await queryCollection<'articles'>(event, 'articles')
    .path(`/articles/${slug}`)
    .first()

  return article
}

export const findArticles = async (event: H3Event) => {
  const articles = await queryCollection<'articles'>(event, 'articles')
    .order('date', 'DESC')
    .all()

  return articles
}
```

最初は、`queryCollection` の where句 にて公開日時の絞り込みを行おうと考えていたのですが、日付の比較までで時刻までは比較できなそうだったのと、単一記事では where できなそうだたりで少々都合が悪かったので、モデル層にてフィルターを行うよう実装しました。

### Model

Models では、Repository から取得したデータをドメインモデルに変換し、ビジネスロジックを提供します。

今回は、公開前の記事をフィルターする処理を行います。<br>
日時の比較に Day.js を使用するので各自インストールお願いします。

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

  // publishedAt が現在時刻以降か判定する
  return now.isSameOrAfter(dayjs(article.publishedAt).tz(TIME_ZONE))
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

エンドポイントを叩いてみて、レスポンスが公開済み記事のみになっていればサーバー側の実装完了です。

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

以上です。
