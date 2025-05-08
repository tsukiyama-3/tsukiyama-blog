---
title: <head>管理ライブラリ Unhead の紹介
description: フレームワーク非依存<head>管理ライブラリのUnheadの紹介です。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465747/tsukiyama_cqdytg.png
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1746433649/tsukiyama-blog/introduce-unhead/Frame_6_pwvdwd.png
published: true
date: 2025-05-05
tags: ["JavaScript", "UnJs"]
---

## はじめに

本記事は JavaScript ツール群の UnJS の一つである Unhead について紹介する記事です。<br>
業務で触れる機会があったので備忘録がてら記事にまとめていこうと思います。

現代の SSR/CSR で作られる Web アプリケーションではページタイトル・メタ情報・OGP などを画面に応じて動的に変更する必要があります。<br>
これらを毎回手動で管理するのは大変で煩雑になります。<br>
こうした課題を解決するために登場したのが、UnJS 製のヘッド管理ライブラリ**Unhead**です。

## Unhead とは？

::LazyExternalLinkCard{url="https://unhead.unjs.io/"}
::

Web アプリケーション向けの**フレームワークに依存しないヘッド管理ライブラリ**です。<br>
通常、メタタグや OGP タグはテンプレートに直書きしたり、手動で状態を管理する必要がありますが、Unhead を使うと`<head>`の管理を SSR/CSR 双方に対応できます。

## 使ってみる

今回は Vue に Unhead をインストールして使ってみます。

::LazyExternalLinkCard{url="https://unhead.unjs.io/docs/vue/head/guides/get-started/installation"}
::

### `useHead()`

::LazyExternalLinkCard{url="https://unhead.unjs.io/docs/vue/head/api/composables/use-head"}
::

`useHead()`は`<head>`タグの設定を管理する型安全なリアクティブ API を提供します。<br>
また、後に紹介する Composables でも使用される Core Composables です。

```vue
<script setup lang="ts">
useHead({
  title: "Unhead Demo",
  meta: [{ name: "description", content: "This is a demo of Unhead!" }],
});
</script>
```

### `useHeadSafe()`

::LazyExternalLinkCard{url="https://unhead.unjs.io/docs/vue/head/api/composables/use-head-safe"}
::

`useHeadSafe()`は`useHead()`のセキュリティに焦点を当てたラッパーです。<br>
安全な値のみを許可するように入力を制限し、信頼できないコンテンツを扱うときに XSS 攻撃からの保護を提供します。


#### ユースケース

例えば、ユーザーのプロフィールページでユーザの設定した文字列を`<head>`内で使用する場合があると思います。XSS攻撃のリスクがある項目を安全にフィルタリングしてくれます。

```vue
<script setup lang="ts">
import { useHeadSafe } from '@unhead/vue'

const profile = await useProfile(userId)

useHeadSafe({
  title: profile.pageTitle,
  meta: [
    { name: 'description', content: userProfile.pageDescription },
    ...profile.customMetaTags // これらは安全にフィルタリングされます
  ]
})
</script>
```

### `useSeoMeta()`

::LazyExternalLinkCard{url="https://unhead.unjs.io/docs/vue/head/api/composables/use-seo-meta"}
::

`useSeoMeta()`は`useHead()`のSEOに焦点を当てたラッパーです。<br>
TypeScriptをサポートしたフラットオブジェクトとしてメタタグを定義できます。

これにより、`property`属性の代わりに`name`を使用するようなよくある間違いを避けることができ、100以上のmetaタグが完全に型付けされているため、タイプミスを防ぐことができます。


#### ユースケース

```vue
<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'About',
  description: 'My about page',
  ogDescription: 'Still about my about page',
  ogTitle: 'About',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
```

### `useScript()`

::LazyExternalLinkCard{url="https://unhead.unjs.io/docs/vue/head/api/composables/use-script"}
::

`useScript()`はサードパーティースクリプト（Google Analytics や 広告タグなど）を**安全かつ効率的に読み込むため**のコンポーザブルです。<br>
サードパーティースクリプトのパフォーマンス、セキュリティ、ライフサイクルを管理できます。

これにより、スクリプトがロードされる前にトラッキング処理を実行してしまうミスや、同一スクリプトを重複して読み込んでしまうパフォーマンス上の問題を防ぐことができます。

#### ユースケース

このようなサードパーティのスクリプトがあるとします

```js [myScript.js]
(function (globalName) {
  if (!window[globalName]) {
    const queue = []
    const api = function (...args) {
      queue.push(args)
    }

    api._queue = queue
    api._ready = false
    api.init = function () {
      api._ready = true
      console.log(`[${globalName}] initialized`)
      console.log(`[${globalName}] queued calls:`, queue)
    }
    api.track = function (eventName, payload) {
      if (!api._ready) {
        return queue.push(['track', eventName, payload])
      }
      console.log(`[${globalName}] Tracking:`, eventName, payload)
    }

    window[globalName] = api
  }
})('myScript')
```

よくあるスクリプトです。初期化処理とトラックイベントが用意されています。<br>
今回は動作確認のために、初期化処理やトラッキング時に console.log() を出力するようにしています。

```vue
<script setup lang="ts">
import { useScript } from '@unhead/vue'

const { onLoaded } = useScript('/scripts/myscript.js', {
  trigger: 'client',
  use: () => window.myScript,
})

// スクリプトロード後に初期化＆イベントを送る
onLoaded((api) => {
  console.log('myscript loaded:', api)
  api.init()
  api.track('pageview', { url: '/' })
})
</script>
```

Consoleを確認するとイベントが発火していることがわかります。

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1746431984/tsukiyama-blog/introduce-unhead/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-05_16.58.47_et58l8.png)

## Nuxt ではどうなのか？

Unhead は Nuxt 3 でもデフォルトで採用されており、`useHead()` や `useSeoMeta()` は追加インストールなしでそのまま使えます。<br>
(`nuxt v3.16`からは`unhead v2`がデフォルトでサポートされています)

::LazyExternalLinkCard{url="https://nuxt.com/blog/v3-16"}
::

`useScript()`は Nuxt 3 にデフォルトでは含まれていません。<br>
Nuxt Scripts を追加でインストールすることで使用できます。

::LazyExternalLinkCard{url="https://scripts.nuxt.com/"}
::

## おわりに

今回は、Unhead の基本的な使い方と主要な Composables について紹介しました。<br>
`<head>`の管理は少しの設定ミスでページスピードが遅くなったりセキュリティ上の脅威になるので適切に設定していきたいですね。

次回は、Nuxt Modules の Nuxt Scripts についても紹介したいと思います。
