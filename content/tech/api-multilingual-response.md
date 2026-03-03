---
title: API レスポンスを多言語対応する
description: 
icon: /avatar_green_oab8qx.webp
tags: ["Google Cloud Translation API", "Nuxt.js", "Nuxt Content"]
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1772369627/tsukiyama-blog/nuxt-content-scheduled-posts/nuxt-content-scheduled-posts_phjsvn.webp
published: true
date: 2026-03-09
publishedAt: 2026-03-09 08:00
---

## Intro | はじめに

去年くらいに担当している案件で多言語対応を行ったのですが、

## Motivation | 動機

Nuxt で多言語対応を行いたい。

平文については `@nuxtjs/i18n` にて対応できるが、API レスポンスはその限りではないので自前で対応する必要があります。

すぐに思いつく方法としては、API エンドポイントやクエリを分けて多言語化したレスポンスを返す方法。

`/api/en/posts`<br>
`/api/posts?lang=en`<br>
のようなイメージ。

ただ、この方法だと API（CMS）側で同じコンテンツを対応言語の数だけ管理しないといけないのと、自前でそれぞれの言語に翻訳しなければならないのが面倒。

そんなことを考えながら調べていると、翻訳サービスなるものをいくつか見つけたので剪定をしていきます。

翻訳ツールは主に以下の2パターンあるようです。

- サードパーティスクリプトを配置し、クライアント側で翻訳を行うサービス
- APIを使って翻訳を行うサービス

クライアント側での翻訳は SEO 的に問題ありそうなので却下。<br>
コスト（金額）面のことも考え Google Cloud Translation API を使用することで落ち着きました。

## Overview

```
root/
├ app
│ └ composables
│   └ posts
└ server
  ├ api
  │ └ articles
  │   ├ [slug]
  │   │ └ index.get.ts
  │   └ index.get.ts
  └ domains
    ├ models
    │ └ article
    │   └ index.ts
    └ repositories
      └ article
        └ index.ts
```

CMS は何でも良いのですが、せっかくなので本ブログで採用している Nuxt Content を使用したサンプルを実装していきます。（記事書くついでに本ブログも多言語できるからね。）

## Server



## Outro | おわりに


