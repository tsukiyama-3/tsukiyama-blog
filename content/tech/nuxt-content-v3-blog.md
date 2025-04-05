---
title: Nuxt Content v3 + Nuxt Hub を使って爆速で個人ブログを作って公開する
description: 2025 年 1 月にリリースされた Nuxt Content v3 とNuxt Hubを使って個人ブログを爆速で作っていきます。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742466220/green-transparent_gw7l0b.png
published: true
date: 2025-03-19
tags: ["Nuxt.js", "Vue.js", "Cloudflare", "Tailwind CSS"]
---

## はじめに

::ExternalLinkCard{url="https://www.npmjs.com/package/cheerio"}
::

はじめまして、フリーランスのエンジニアとして働いている**つきやま**です。<br>
Vue, Nuxt, CSS が好きです。<br>
技術以外だと最近はポケポケと短歌を嗜んでいます。

この度、個人ブログを作る運びとなり、本記事は記念すべき一本目の記事です。<br>
せっかくなので一本目の記事は本ブログのような個人ブログを爆速で作る方法の記事を書こうと思います。

## 対象読者

✅ **個人ブログを Vue / Nuxt で作ろうと考えている方**<br>
✅ **Nuxt Content v3 の機能に興味がある方**<br>
✅ **Nuxt Hub を使って Web サイトを公開したい方**<br>

## 事前準備

本記事では Nuxt Hub を利用してデプロイを行います。<br>
Nuxt Hub を利用する際に必要なアカウント類の登録を行います。

（すでにアカウントお持ちの方は飛ばしてください。）

### GitHub

GitHub アカウントと公開するサービスのリポジトリを用意をお願いします。

### Cloudflare

Cloudflare Pages にホスティングするのでアカウントの作成をお願いします。

### Nuxt Hub

Nuxt Hub を用いて Cloudflare にデプロイするのでアカウント作成をお願いします。

## 環境構築

### Nuxt インストール

::ExternalLinkCard{url="https://nuxt.com/docs/getting-started/installation"}
::

```bash
$ npm create nuxt sample-blog
```

プロジェクト名は任意の名前をつけてください。<br>
インストールの際にいくつか質問されるので適当に答えます。<br>
インストールが済んだらディレクトリを移動して、開発サーバーを起動してみましょう。

```bash
cd sample-blog
npm run dev
```

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1743334480/tsukiyama-blog/nuxt-content-v3-blog/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-30_20.29.14_yc0omm.png)

`localhost:3000`にアクセスして Welcome ページが表示されていれば完了です。

### Nuxt Content インストール

::ExternalLinkCard{url="https://content.nuxt.com/docs/getting-started/installation"}
::

```bash
npx nuxi module add content
```

### Nuxt Hub インストール

::ExternalLinkCard{url="https://hub.nuxt.com/docs/getting-started/installation"}
::

```bash
npx nuxi module add hub
```

### Zod インストール

::ExternalLinkCard{url="https://www.npmjs.com/package/zod"}
::

コンテンツのスキーマ定義で使用するバリデーションライブラリです。

```bash
npm install zod
```

### Tailwind CSS (Nice to Have)

::ExternalLinkCard{url="https://tailwindcss.com/docs/installation/using-vite"}
::

```bash
npm install tailwindcss @tailwindcss/vite
```

`nuxt.config.ts`に vite plugins を追加します。

```ts [nuxt.config.ts]
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // ...
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`~/assets/css/tailwind.css`を新規作成します。

```css [tailwind.css]
@import "tailwindcss";
```

## デプロイしてみる

一通りの環境構築を終えたのでこの段階で一旦デプロイしてみましょう。

### デプロイコマンド

```bash
npx nuxthub deploy
```

デプロイコマンドを実行するといくつか質問されます<br>
基本的にデフォルトの回答で大丈夫だと思います。

region だけ `Asia Pacific` を選びました。

```bash
$ npx nuxthub deploy
NuxtHub CLI
ℹ No project is linked with the NUXT_HUB_PROJECT_KEY environment variable.
│
◇  Deploy ~/projects/sample-blog to NuxtHub?
│  Yes
│
◇  Select a project
│  Create a new project
│
◇  Project name
│  sample-blog
│
◇  Select a region for the storage
│  Asia Pacific
│
◇  Production branch (git)
│  main
✔ Project sample-blog created
✔ Connected to tsukiyama-3 team.
✔ Linked to sample-blog project.
```

問題なければビルドが走ります。<br>
ビルドに成功するとデプロイ先の URL が表示されるのでアクセスしてみましょう。

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1743348385/tsukiyama-blog/nuxt-content-v3-blog/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-31_0.26.01_kws1ic.png)

Welcome ページが表示されていたら完了です。

## Nuxt Content の機能の紹介

ブログの実装に入る前に軽く Nuxt Content の機能に触れておきます。

Nuxt Content は 2025 年 1 月に v3 がリリースされました。<br>
v3 の主な機能は公式ブログにまとめられています。

::ExternalLinkCard{url="https://content.nuxt.com/blog/v3"}
::

### コンテンツの管理方法

v3 では従来のファイルベースの管理から SQL のデータベースシステムに移行しました。<br>
ファイル管理の方法が変わったからといって内部でいい感じに `.sqlite` ファイルを生成してくれているので使う際に特に意識する必要はないと思います。<br>

コンテンツはルート直下に`/content`を作成して管理します。<br>
引き続き、`markdown`の他にも`json`ファイルや`yaml` `csv`ファイルの管理も可能です。

#### コンテンツコレクション

Nuxt Content v3 ではコレクションを定義してコンテンツを管理します。<br>
コレクションとは、関連するコンテンツのグループです。

コレクションの定義は`content.config.ts`で行います。

```ts [content.config.ts]
import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
    }),
  },
});
```

#### 一覧取得

#### 詳細取得

#### ナビゲーション

## 個人ブログ実装

### TOP ページ

### 記事ページ

## 公開する

## おわりに
