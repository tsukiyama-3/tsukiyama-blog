---
title: デバイスの位置情報を取得する Geolocation API の紹介
description: 簡単にデバイスの位置情報を取得できる Web API Geolocation API の紹介です。
icon: /avatar_bwg8e2.webp
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1745236671/tsukiyama-blog/geo-location-api/geo-location-api_dwk5a7.png
published: true
date: 2025-04-22
tags: ["JavaScript", "Web API"]
---


## はじめに

Web で位置情報を簡単に扱える Geolocation API を紹介します。

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/API/Geolocation_API"}
::

Geolocation API は Web 標準のAPIで、ユーザーの位置情報（緯度・経度）の取得ができます。<br>
利用にはユーザ許可が必要です。

## 基本的な使い方

```ts
// 位置情報を取得する
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(`緯度：${position.coords.latitude}`, `経度：${position.coords.longitude}`)
  },
  (error) => {
    console.error(error)
  }
)
```

Web 標準のAPIなので何かをインストールすることなく使用できます。<br>
ブラウザで確認するとユーザー許可のダイアログが展開されます。
許可すると位置情報の取得ができます。

## 継続的に位置を取得する方法

`getCurrentPosition()` は位置情報を一度だけ取得するメソッドでした。<br>
継続的に取得するためには `watchPosition()` を使用します。

```ts
// 位置情報を監視する
const watchID = navigator.geolocation.watchPosition(
  (position) => {
    console.log(`緯度：${position.coords.latitude}`, `経度：${position.coords.longitude}`)
  },
  (error) => {
    console.error(error)
  }
)

// 位置情報の監視を終了する
const clear = () => {
  navigator.geolocation.clearWatch(watchID)
}
```

`watchPosition()` は位置情報を識別するIDを返します。<br>
監視を終了するには、`clearWatch()` に ID を渡します。

## 実装例

```ts [geo-location.ts]
export const useGeoLocation = () => {
  const position = ref<GeolocationPosition | null>(null)
  const getPosition = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      position.value = pos
    })
  }
  return { position, getPosition }
}

```

```vue [GeoLocation.vue]
<script setup lang="ts">
import { useGeoLocation } from '~/composables/articles/geolocation-api'

const { position, getPosition } = useGeoLocation()
</script>

<template>
  <div class="space-y-2">
    <ul class="space-y-2">
      <li>緯度：{{ position?.coords.latitude }}</li>
      <li>軽度：{{ position?.coords.longitude }}</li>
    </ul>
    <button
      class="bg-blue-600 w-fit block mx-auto text-white rounded-sm py-1 px-2 cursor-pointer"
      @click="getPosition"
    >
      位置情報を取得する
    </button>
  </div>
</template>
```

### 動かしてみる

::DemoBrowser
  ::GeoLocation
  ::
::

## おわりに

今回は Geolocation API を使ってブラウザで位置情報を扱う方法についてまとめました。<br>
位置情報を使って作ってみたいものがあるので機会があれば記事にしようと思います。
