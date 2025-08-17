---
title: Nuxt アプリケーションでサードパーティスクリプトを最適化する Nuxt Scripts の紹介
description: サードパーティスクリプトの最適化・遅延読み込みなど、Nuxt.js アプリケーションにおける高度なスクリプト管理を可能にする Nuxt Modules、 Nuxt Scripts の紹介です。
icon: /avatar_green_oab8qx.webp
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1747046645/tsukiyama-blog/nuxt-scripts-introduce/nuxt-scripts-introduce_lts8lo.webp
published: true
date: 2025-05-12
tags: ["JavaScript", "Nuxt.js", "Vue.js"]
---

## はじめに

Web サービスを開発する上で、計測タグや広告配信タグなどのサードパーティースクリプトの導入は避けては通れません。

しかし、これらのスクリプトはページ表示速度やユーザー体験を損なう原因になりがちで、特に複数のタグが混在する大規模なアプリケーションでは管理が煩雑になります。

本記事では、Nuxt.js アプリケーションにおける**サードパーティースクリプトの最適化をサポートするモジュール Nuxt Scripts** について紹介します。

::ExternalLinkCardWrapper{url="https://scripts.nuxt.com/"}
::

## Nuxt Scripts では何ができるの？

Nuxt Scripts は、サードパーティースクリプトの**読み込み・管理・最適化**を行うための Nuxt モジュールです。

従来、`<script>` タグを `useHead()` などで手動で挿入していた場合、以下のような課題がありました

- 読み込みの重複や順序管理が煩雑
- SSR との相性問題（クライアント限定で読み込みたい場面など）
- 複数ページ間での再利用性の低さ

Nuxt Scripts を使うと、こうした課題を次のように解決できます

- `useRegistryScript()` で script を一元管理
- 重複読み込みを自動で防止
- `onLoaded()` を使った読み込み完了後の処理
- proxy 経由でグローバルオブジェクトを型安全に扱える

### 利用可能なサードパーティースクリプト

::ExternalLinkCardWrapper{url="https://scripts.nuxt.com/scripts"}
::

こちらのページにすぐに使用できるコンポーザブルがまとまっています。

Google Analytics や X Pixel など、よく使うスクリプトはあらかじめコンポーザブルとして提供されています。<br>
よく使われるグローバルなスクリプトは概ね対応済みです。<br>
日本のサービスが提供しているスクリプトは基本的にないです。

詳しくは公式ドキュメントをご覧ください。

## Youtube Player で使ってみる

今回は、用意されているスクリプトの中の Youtube Player を使ってみます。

::ExternalLinkCardWrapper{url="https://scripts.nuxt.com/scripts/content/youtube-player"}
::

### コンポーネント

```vue [~/components/YouTubePlayer.vue]
<script setup lang="ts">
defineProps<{
  videoId: string;
}>();
const isLoaded = ref(false);
const isPlaying = ref(false);
const video = ref();
const stateChange = (state: { data: number }) => {
  isPlaying.value = state.data === 1;
};
</script>

<template>
  <ScriptYouTubePlayer
    ref="video"
    :video-id="videoId"
    @ready="isLoaded = true"
    @state-change="stateChange"
  >
    <template #awaitingLoad>
      <div
        class="absolute left-1/2 top-1/2 h-[48px] w-[68px] -translate-x-1/2 -translate-y-1/2 transform"
      >
        <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
          <path
            d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
            fill="#f00"
          />
          <path d="M 45,24 27,14 27,34" fill="#fff" />
        </svg>
      </div>
    </template>
  </ScriptYouTubePlayer>
</template>
```

`<ScriptYouTubePlayer>` を呼びつつ `slot` 内に再生ボタンをおきます。

### テンプレート

```vue [~/pages/index.vue]
<template>
  <YouTubePlayer video-id="xxx" />
</template>
```

props として videoId を渡します。

### 表示はこんな感じ

::div{class="rounded-md overflow-hidden"}
  ::YouTubePlayer{videoId="d_IFKP1Ofq0"}
  ::
::

## Script Registry に登録されていないスクリプトの読み込み

`Script Registry` に用意されていないスクリプトも `useRegistryScript()` を使うことで読み込めます。

今回は Tiktok Pixel タグの設定を例に進めていきます。

### コンポーザブル

`ttq` の Proxy オブジェクトを提供するコンポーザブルを作成します。<br>
（※あくまでサンプル実装であり、実運用を保証するものではありません。正しく Tiktok Pixel タグを設定したいかたは[こちらを参考](https://github.com/nuxt/scripts/discussions/177#discussioncomment-10128841){target="_blank"}に実装してください

```ts [~/composables/analytics/tiktok.ts]
export const useTiktokPixel = () => {
  // runtimeConfig などで sdkId を管理する
  const { sdkId } = useRuntimeConfig();
  const { proxy, onLoaded } = useRegistryScript("karte", () => ({
    scriptInput: {
      src: `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${sdkId}&lib=ttq`,
      crossorigin: false,
    },
    scriptOptions: {
      use() {
        return { ttq: window.ttq }
      },
    },
    clientInit: () => {
      // @ts-expect-error Tiktok提供スクリプトのため型エラーを許容している
      // prettier-ignore
      // eslint-disable-next-line
      !function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie", "holdConsent", "revokeConsent", "grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(sdkId)}(window, document, 'ttq');
    }
  }))

  return {
    proxy,
    onLoaded,
  }
}
```

### テンプレート

```vue [~/pages/index.vue]
<script setup lang="ts">
import { useTiktokPixel } from '~/composables/analytics/tiktok'

// Tiktok Pixelタグ
const { proxy } = useTiktokPixel()
onMounted(() => {
  proxy.ttq.page()
})
</script>

```

送信したいイベントを Proxy オブジェクトから呼べます。

## おわりに

今回は Nuxt Scripts の基本的な使い方について解説しました。

手前味噌ですが、私自身も Nuxt Scripts にコントリビュートしています。（軽微なバグ修正ですが、）<br>
まだドキュメントが整っていない部分や、改善の余地がある箇所もあるため、
もし興味があれば、ぜひ皆さんも気軽に貢献してみてください！

![](https://res.cloudinary.com/dyoyv8djx/image/upload/v1746967157/tsukiyama-blog/nuxt-scripts-introduce/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_21.37.34_ucbhoc.png)

コントリビュートすると、公式ページにアイコンを掲載してもらえます。
