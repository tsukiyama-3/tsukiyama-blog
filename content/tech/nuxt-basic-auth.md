---
title: Nuxt で Basic 認証を実装してみる
description: Nuxt で Basic 認証を実装する備忘録です。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742466220/green-transparent_gw7l0b.png
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1749222843/tsukiyama-blog/nuxt-basic-auth/nuxt-basic-auth_kj3jlm.png
published: true
date: 2025-06-06
tags: ["Nuxt.js"]
---

## はじめに

Nuxt での Basic 認証を実装する方法について気になったので実装してみたときの備忘録です。

## 参考

サードパーティ製のモジュールとして公開されている@kgierke/nuxt-basic-auth を参考に実装しました。<br>
こだわりがなければ、こちらをインストールして使用することをお勧めします。

::LazyExternalLinkCard{url="https://github.com/kgierke/nuxt-basic-auth/tree/main"}
::

公式モジュールではないことと、最終更新日が8ヶ月前だったので自分で実装してみることにしました。<br>
（全体に一律で認証をかけたいだけで、わざわざモジュール入れるほどではなかったので）

## ソースコード

### server/middleware

```ts [~/server/middleware/basic-auth.ts]
export default defineEventHandler((event) => {
  const { basicAuth } = useRuntimeConfig()

  // ローカルでは無視する
  if (import.meta.dev) {
    return
  }

  // allowedRoutes に指定されていればスキップする
  if (basicAuth.allowedRoutes?.some((route: string) => {
    const regex = new RegExp(route)

    return regex.test(event.node.req.url || '')
  })) {
    return
  }

	// 認証を判定する真偽値
  let authenticated = false

  // Authorizationヘッダーから認証情報を取得する
  const credentials = event.node.req.headers.authorization?.split(' ')[1]

  if (credentials) {
	  // base64 形式から utf-8 の String へ変換する
    const [username, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':')

		// username と password が一致しているかどうか
    authenticated = username === basicAuth.username && password === basicAuth.password

		// 一致していれば認証通過
    if (authenticated) return
  }

	// 一致していなければ Unauthorized レスポンスを返す
  event.node.res.statusCode = 401
  event.node.res.setHeader(
    'WWW-Authenticate',
    'Basic realm="Secure Area", charset="UTF-8"',
  )
  event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  event.node.res.end('Access denied')
})

```

### nuxt.config

```ts [~/nuxt.config.ts]
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// ...
  runtimeConfig: {
    basicAuth: {
	    // 認証情報を管理する
      username: 'admin',
      password: 'admin',
      allowedRoutes: [],
    },
  },
  // ...
})

```

GitHubに公開したくなければ `.env` などで管理しましょう。

## 使ってみる

実際に Basic 認証をかけたページを用意してみました。

<NuxtLink to="/basic-auth" external class="text-blue-600 block hover:underline cursor-pointer">Basic認証サンプルページ</NuxtLink>

`username: admin`<br>
`password: admin`

で通過できます。

### ⚠️ 注意

`server/middleware` に実装しているので、SSR時の画面ロードではBasic 認証がかかりますが、**CSR時にはかかりません**。

ページ全体に認証をかける場合は問題ないのですが、特定のページだけ認証をかけたい場合は以下の対応も必要になります。

- `middleware/` にもチェックを追加する
- Basic認証を適用するページへは、クライアントサイドルーティングを避けるために `<NuxtLink>` に `external` を付けて遷移させる

ただ、特定のページだけ認証を付与するユースケースは一般的ではないと思うので具体的な対応方針については本記事では割愛しています。

## まとめ

- Nuxt での Basic認証 は `server/middleware` で実装する
- CSR時にはBasic認証がかからないので別途対応が必要である
