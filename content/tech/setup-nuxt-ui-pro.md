---
title: Nuxt UI Pro をインストールして Nuxt Hub でデプロイしてみる
description: 有料の Nuxt UI フレームワークである Nuxt UI Pro のインストールからデプロイまでを紹介します。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742466220/green-transparent_gw7l0b.png
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039379/tsukiyama-blog/nuxt-content-v3-blog/ogp-nuxt-content_gg1qi7.png
published: true
date: 2025-07-06
tags: ["Nuxt.js", "Cloudflare", "Tailwind CSS"]
---

## はじめに

今回は、`Nuxt UI Pro` のライセンスを購入して本ブログで利用してみたので
デプロイまでの手順をまとめたいと思います。

::note
`Nuxt UI Pro` を使ってみての所感などは日を改めて記事にしようと思います。
::

### `Nuxt UI` について

::ExternalLinkCardWrapper{url="https://ui.nuxt.com/"}
::

`Nuxt UI` は Nuxt 公式の UIコンポーネントライブラリです。

`Tailwind CSS` と `Reka UI` をベースに作られており、カスタマイズ性とアクセシビリティに配慮されています。

現在、50以上のコンポーネントが提供されています。

また、有料版の `Nuxt UI Pro` ではさらに**50以上の追加コンポーネント**や**専用テンプレート**が提供されています。

#### `Nuxt UI Pro` の料金

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1751811251/tsukiyama-blog/setup-nuxt-ui-pro/nuxt-ui-pricing_whz6xb.png)

料金は上記の通りで、**買い切り型のライセンス形式**です。

今回は Solo プランを購入しました。<br>
為替レートと消費税を含めて4万円ほどでした。

::tip
開発環境まではライセンスがなくても使用できます。Build 時にライセンスがないと Build エラーになります。

::code-collapse

```bash
$ npm run build

> build
> nuxt build

Nuxt 3.16.2 with Nitro 2.11.8                                                           nuxi  0:42:59
✔ Processed 3 collections and 16 files in 59.17ms (16 cached, 0 parsed)        @nuxt/content 0:43:00
ℹ Nuxt Icon server bundle mode is set to remote                                              0:43:00
ℹ Building for Nitro preset: cloudflare-pages                                          nuxi  0:43:01

 ERROR  Missing NUXT_UI_PRO_LICENSE license key.                                              0:43:01
Purchase Nuxt UI Pro at https://ui.nuxt.com/pro/pricing to build your app in production.




 ERROR  Missing NUXT_UI_PRO_LICENSE license key.                                              0:43:01
Purchase Nuxt UI Pro at https://ui.nuxt.com/pro/pricing to build your app in production.
```

::

::

## セットアップ

::steps{level="4"}

#### インストール

::code-group

```bash [npm]
npm install @nuxt/ui-pro
```

```bash [pnpm]
pnpm add @nuxt/ui-pro
```

```bash [yarn]
yarn add @nuxt/ui-pro
```

```bash [bun]
bun add @nuxt/ui-pro
```

::

#### `nuxt.config.ts`{lang="ts-type"} の `modules` を追加

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro']
})
```

#### Tailwind CSS と Nuxt UI Pro を CSS にインポート

::code-group

```css [assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui-pro";
```

```ts [nuxt.config.ts] {3}
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro'],
  css: ['~/assets/css/main.css']
})
```

::

::

開発サーバーであればライセンス購入前でも確認できます。

```bash
npm run dev
```

```vue [app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

## デプロイ

### ライセンスキー発行

ライセンスキーを取得しないとデプロイできないので、まずは`Nuxt UI Pro`を購入します。<br>
プランを選んで購入するとライセンスキーが発行されます。

::caution
ライセンスキーを GitHub 上に公開しないようにしてください。
::

### ローカルでビルドしてみる

発行されたライセンスキーを使ってローカルでビルドしてみます。

`.env`にライセンスキーを貼り付けます。

```env [.env]
NUXT_UI_PRO_LICENSE=<your-license-key>
```

`npm run build`するとビルドが成功すると思います。

### Nuxt Hub でデプロイしてみる

Nuxt Hub には 2 種類のデプロイ方法があります。

1. デプロイコマンドを実行する
2. `GitHub`と連携して Push したタイミングで自動デプロイする

::ExternalLinkCardWrapper{url="https://hub.nuxt.com/docs/getting-started/deploy"}
::

ライセンスキーを環境変数として持つときに設定場所がそれぞれ異なります。

#### 1. デプロイコマンドを実行する

#### 2. `GitHub`と連携して Push したタイミングで自動デプロイする

## おわりに
