---
title: Nuxt Content v3 + Nuxt Hub を使って爆速で個人ブログを作って公開する
description: 2025 年 1 月にリリースされた Nuxt Content v3 とNuxt Hubを使って個人ブログを爆速で作っていきます。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742466220/green-transparent_gw7l0b.png
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039379/tsukiyama-blog/nuxt-content-v3-blog/ogp-nuxt-content_gg1qi7.png
published: true
date: 2025-04-08
tags: ["Nuxt.js", "Vue.js", "Cloudflare", "Tailwind CSS"]
---

> ブログはソフトウェア開発者のセルフマーケティングで使える最良のメディアのひとつだ。実際、自分のキャリアを大事に考えるすべてのソフトウェア開発者は、ブログの作成に投資すべきだと私は強く思っている。

:p[ジョン・ソンメズ. SOFT SKILLS ソフトウェア開発者の人生マニュアル 第2版 (p.186).]{class="text-right text-xs italic opacity-80"}

## はじめに

はじめまして、フリーランスのエンジニアとして働いている**つきやま**です。<br>
Vue, Nuxt, CSS が好きです。<br>
技術以外だと最近はポケポケと短歌を嗜んでいます。

この度、個人ブログを作る運びとなり、本記事は記念すべき一本目の記事です。<br>
せっかくなので一本目の記事は本ブログのような**個人ブログを爆速で作る方法**の記事を書こうと思います。

記事のテーマとして**個人ブログを爆速で作る**と掲げているので、ブログの根幹となる機能の解説しかしません。<br>
（＝細かな機能やUIについては解説しないです）

Nuxt Content は 2025 年 1 月に v3 がリリースされました。<br>
v3 の主な機能は公式ブログにまとめられています。

::ExternalLinkCardWrapper{url="https://content.nuxt.com/blog/v3"}
::


## 事前準備

さっそく実装に入りたいところですが、実装に入る前に各種アカウント作成をする必要があるので作成がまだの方は作成をお願いします。<br>
（すでにアカウントお持ちの方は飛ばしてください。）

本記事では Nuxt Hub を利用してデプロイを行います。<br>
Nuxt Hub を利用する際に必要なアカウント類の登録を行います。

### GitHub

GitHub アカウントと公開するサービスのリポジトリを用意をお願いします。

::ExternalLinkCardWrapper{url="https://github.com/signup"}
::

### Cloudflare

Cloudflare Pages にホスティングするのでアカウントの作成をお願いします。

::ExternalLinkCardWrapper{url="https://dash.cloudflare.com/sign-up"}
::

### Nuxt Hub

Nuxt Hub を用いて Cloudflare にデプロイするのでアカウント作成をお願いします。

::ExternalLinkCardWrapper{url="https://admin.hub.nuxt.com/?utm_source=hub-docs&utm_medium=header&utm_campaign=signup"}
::

## 環境構築

### Nuxt インストール

::ExternalLinkCardWrapper{url="https://nuxt.com/docs/getting-started/installation"}
::

```bash
$ npm create nuxt sample-blog
```

プロジェクト名は任意の名前をつけてください。<br>
インストールが済んだらディレクトリを移動して、開発サーバーを起動してみましょう。

```bash
cd sample-blog
npm run dev
```

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1743334480/tsukiyama-blog/nuxt-content-v3-blog/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-30_20.29.14_yc0omm.png)

`localhost:3000`にアクセスして Welcome ページが表示されていれば完了です。

**デプロイの際にGitHubリポジトリと紐づける必要があるのでリポジトリの作成・紐付けも行います。**

### Nuxt Content インストール

::ExternalLinkCardWrapper{url="https://content.nuxt.com/docs/getting-started/installation"}
::

```bash
npx nuxi module add content
```

### Nuxt Hub インストール

::ExternalLinkCardWrapper{url="https://hub.nuxt.com/docs/getting-started/installation"}
::

```bash
npx nuxi module add hub
```

### Tailwind CSS (Nice to Have)

（Tailwind CSS はインストールしなくても問題ないです。）

::ExternalLinkCardWrapper{url="https://tailwindcss.com/docs/installation/using-vite"}
::

```bash
npm install tailwindcss @tailwindcss/vite
```

`~/assets/css/tailwind.css`を新規作成します。

```css [tailwind.css]
@import "tailwindcss";
```

`nuxt.config.ts`に Tailwind CSS の記述を追加します。

```ts [nuxt.config.ts]
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // ...
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
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

Welcome ページが表示されていたら完了です。<br>

## 実装

環境構築も終えたのでいよいよ実装に入っていきます。

### コレクション定義

v3 では従来のファイルベースの管理から SQL のデータベースシステムに移行しました。<br>
ファイル管理の方法が変わったからといって内部でいい感じに `.sqlite` ファイルを生成してくれているので使う際に特に意識する必要はないと思います。

::ExternalLinkCardWrapper{url="https://content.nuxt.com/docs/files/markdown"}
::

Nuxt Content v3 ではコレクションを定義してコンテンツを管理します。<br>
コレクションとは、関連するコンテンツのグループです。

コレクションの定義は`content.config.ts`で行います。<br>
`content.config.ts`を新規作成します。

コレクションには任意でスキーマの定義もできます。

```ts [content.config.ts]
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      // スキーマ定義
      schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
        published: z.boolean(),
      })
    }),
  },
})
```

### コンテンツ作成

コンテンツはルート直下に`/content`を作成して管理します。<br>
ためしに`~/content/blog/`配下にいくつか以下のようにマークダウンファイルを作成してみます。

```md [content/blog/0401.md]
---
title: 4月1日の記事
description: 4月1日の記事です。
image: https://picsum.photos/584/328
published: true
---

# タイトル

パラグラフ
```

### TOP ページ

`~/pages/index`を作成します。

```vue [pages/index.vue]
<script setup lang="ts">
const { data } = await useAsyncData('blog', () =>
  queryCollection('blog').all(),
)
</script>

<template>
  <div>
    <ul class="space-y-8">
      <li
        v-for="article in data"
        :key="article.path"
        class="list-none divide-y divide-gray-300 hover:opacity-70"
      >
        <NuxtLink
          :to="article.path"
          class="gap-x-4"
        >
          <div class="space-y-1 text-blue-600 underline">
            <h3 class="text-base md:text-xl font-bold">{{ article.title }}</h3>
            <p class="text-sm md:text-base opacity-80">
              {{ article.description }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
```

コンテンツの取得は`queryCollection`を用います。<br>
`published`が`true`の記事を取得するように絞り込んでいます。

::ExternalLinkCardWrapper{url="https://content.nuxt.com/docs/utils/query-collection"}
::

`app.vue`も修正します。

```vue [app.vue]
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

画面確認すると`/content`配下に配置した記事が表示されていると思います。

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1743910602/tsukiyama-blog/nuxt-content-v3-blog/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-06_12.30.49_zljzpx.png)

### 記事ページ

記事ページとして`pages/blog/[...slug]/index.vue`を作成します。

```vue
<!-- pages/blog/[...slug]/index.vue -->
<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)
</script>

<template>
  <div class="max-w-[800px] mx-auto">
    <article
      v-if="data"
      id="article"
      class="space-y-12"
    >
      <div class="space-y-4">
        <img
          ref="image"
          :src="data.image"
          alt=""
          width="584"
          height="328"
          class="mx-auto"
        >
        <h1 class="font-bold text-xl md:text-3xl">
          {{ data.title }}
        </h1>
        <p class="opacity-80 text-sm md:text-base">
          {{ data.description }}
        </p>
      </div>
      <ContentRenderer
        :value="data"
        class="space-y-8"
      />
    </article>
    <div v-else>
      <h1>記事が見つかりませんでした</h1>
    </div>
  </div>
</template>
```

画面を確認してみるとマークダウンで書いた記事が表示されていると思います。

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1743910601/tsukiyama-blog/nuxt-content-v3-blog/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-06_12.36.23_u4jfrf.png)

## 公開する

Nuxt Hub のダッシューボードから Git リポジトリを紐づけることによって、`main`ブランチにpushするだけでデプロイできるようになります。簡単ですね。<br>
`main`ではないブランチにpushするとプレビュー環境が作られます。嬉しいですね。

`ダッシュボード` > `該当プロジェクト` > `Settings` > `General` > `Git repository` > `Link repository`

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1743914270/tsukiyama-blog/nuxt-content-v3-blog/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-06_13.32.34_nl65ye.png)


（Nuxt Content を Cloudflare Pages にホスティングする場合は、D1データベースに紐付ける必要があるのですが、その辺は Nuxt Hub がいい感じにしてくれているっぽいです。）

## おわりに

本記事では**Nuxt Contentを使って爆速で個人ブログを作る**ことをテーマになるべく寄り道をせずに最低限のステップだけを紹介しました。

細かい機能やUIについてはご自身の好みでカスタマイズしていってください。

本ブログのコードは公開しています。<br>
本記事で実装しているコードとは一部異なりますが気になる箇所があればご覧ください。<br>
（誤字脱字や内容の誤りなどがありましたらコメントやIssueを建てていただけるとありがたいです。）

::ExternalLinkCardWrapper{url="https://github.com/tsukiyama-3/tsukiyama-blog"}
::

今後も主にフロントエンドにまつわる記事を書いていく予定ですので、お見知り置きを。
