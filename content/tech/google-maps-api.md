---
title: Nuxt で Google Maps API を使ってみる
description: Nuxt + Google Maps API を使ってマップの表示とルート表示を行います。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742466220/green-transparent_gw7l0b.png
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1746433649/tsukiyama-blog/introduce-unhead/Frame_6_pwvdwd.png
published: true
date: 2025-07-19
tags: ["Nuxt.js", "GCP", "Google Maps", "Nuxt Scripts"]
---

## はじめに

本記事は、`Nuxt` で `Google Maps API` 使ってみた備忘録です。

`Maps JavaScript API` を使ったマップ表示と、`Directions API` を使ったルート表示までを行います。

## 準備

### API Key 取得

### Map Id 取得

### Nuxt Scripts インストール

## 地図を表示する

まずは、地図を表示してみるところまで進める。

### コンポーネント作成

`~/components/map/BasicMap.vue`を作成して、そこに `Google Maps API` を呼ぶように作る。

```vue [~/components/map/BasicMap.vue]
<script setup lang="ts">
type Position = { lat: number, lng: number }

const props = defineProps<{
  position: Position
  zoom?: number
}>()

const config = useRuntimeConfig()

const mapRef = ref<HTMLElement | null>(null)

const { onLoaded } = useScriptGoogleMaps()

onLoaded(async (instance) => {
  // ref が取得できていなければ return
  if (!mapRef.value) {
    return
  }

  const maps = await instance.maps
  const { Map } = await maps.importLibrary('maps') as google.maps.MapsLibrary

  new Map(mapRef.value, {
    center: props.position,
    zoom: props.zoom ?? 8,
    mapId: config.public.googleMaps.mapId.raster,
  })
})
</script>

<template>
  <div
    ref="mapRef"
    class="w-full aspect-video"
  />
</template>
```

### コンポーネントを呼ぶ側

`props` として 緯度・経度、ズーム値を渡す。

```vue [index.vue]
// 皇居の緯度経度を渡す
<BasicMap :position="{ lat: 35.685355, lng: 139.753144 }" :zoom="14" />
```

### 画面表示はこんな感じ

::BasicMap{:position="{\"lat\":35.685355,\"lng\":139.753144}" :zoom="14"}
::

## 地図にマーカーを追加する

少し手を加えて、地図上の `position` の位置にマーカーを表示してみる。

### `BasicMap.vue` コンポーネント修正

`BasicMap.vue` を修正する。

```vue [~/components/map/BasicMap.vue]{7,23,25,31-35}
<script setup lang="ts">
type Position = { lat: number, lng: number }

const props = defineProps<{
  position: Position
  zoom?: number
  enableMarker?: boolean // 追加
}>()

const config = useRuntimeConfig()

const mapRef = ref<HTMLElement | null>(null)

const { onLoaded } = useScriptGoogleMaps()

onLoaded(async (instance) => {
  if (!mapRef.value) {
    return
  }

  const maps = await instance.maps
  const { Map } = await maps.importLibrary('maps') as google.maps.MapsLibrary
  const { AdvancedMarkerElement } = await maps.importLibrary('marker') as google.maps.MarkerLibrary // 追加

  const map = new Map(mapRef.value, {
    center: props.position,
    zoom: props.zoom ?? 8,
    mapId: config.public.googleMaps.mapId.raster,
  })

  if (props.enableMarker) { // 追加
    new AdvancedMarkerElement({
      map,
      position: props.position,
    })
  }
})
</script>

<template>
  <div
    ref="mapRef"
    class="w-full aspect-video"
  />
</template>
```

### 画面表示はこんな感じ

::BasicMap{:position="{\"lat\":35.685355,\"lng\":139.753144}" :zoom="14" :enableMarker="true"}
::

## 2点間のルート検索

地図の表示までは

### コンポーネント作成

ルート表示用に新たに`~/components/map/RouteMap.vue`を作成する。

```vue [~/components/map/RouteMap.vue]
<script setup lang="ts">
type Position = { lat: number, lng: number }

const props = defineProps<{
  positions: {
    start: Position
    end: Position
  }
}>()

const config = useRuntimeConfig()

const mapRef = ref<HTMLElement | null>(null)

const { onLoaded } = useScriptGoogleMaps()

onLoaded(async (instance) => {
  if (!mapRef.value) {
    return
  }

  const maps = await instance.maps
  const { Map } = await maps.importLibrary('maps') as google.maps.MapsLibrary
  const { AdvancedMarkerElement } = await maps.importLibrary('marker') as google.maps.MarkerLibrary
  const { DirectionsService, DirectionsRenderer } = await maps.importLibrary('routes') as google.maps.RoutesLibrary

  const map = new Map(mapRef.value, {
    mapId: config.public.googleMaps.mapId.raster,
  })

  const directionsService = new DirectionsService()
  const directionsRenderer = new DirectionsRenderer({ suppressMarkers: true })

  directionsRenderer.setMap(map)

  const origin = new google.maps.LatLng(props.positions.start.lat, props.positions.start.lng)
  const destination = new google.maps.LatLng(props.positions.end.lat, props.positions.end.lng)

  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
  }

  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)
    }
  })
})
</script>

<template>
  <div
    ref="mapRef"
    class="w-full aspect-video"
  />
</template>
```

### コンポーネントを呼ぶ側

```vue
// 皇居 ~ 都庁 間のルート表示
<RouteMap
  :positions="{
    start: { lat: 35.685355, lng: 139.753144 },
    end: { lat: 35.689419, lng: 139.691682 },
  }"
/>
```

### 画面表示はこんな感じ

::RouteMap{:positions="{\"start\":{\"lat\":35.685355,\"lng\":139.753144},\"end\":{\"lat\":35.689419,\"lng\":139.691682}}"}
::

## 複数地点を経由するルート検索

2点間だと、環状のルートを表示するときに詰む。
例えば、山手線の一周のルートを開始・終了位置を新宿駅で設定したとする。

するとこんな感じになる↓

::RouteMap{:positions="{\"start\":{\"lat\":35.689393,\"lng\":139.700647},\"end\":{\"lat\":35.689393,\"lng\":139.700647}}"}
::

開始・終了位置が同じなので当たり前なのだが

中間ウェイポイントを設定することによってこの問題を回避する。

### `RouteMap` コンポーネント修正

```vue [RouteMap.vue]
<script setup lang="ts">
type Position = { lat: number, lng: number }
const props = defineProps<{
  positions: {
    start: Position
    end: Position
    waypoints?: Position[]
  }
  enableMarker?: boolean
}>()
const config = useRuntimeConfig()
const mapRef = ref<HTMLElement | null>(null)
const { onLoaded } = useScriptGoogleMaps({
  apiKey: config.public.scripts.googleMaps.apiKey,
})
onMounted(() => {
  onLoaded(async (instance) => {
    if (!mapRef.value) {
      return
    }
    const maps = await instance.maps
    const { Map } = await maps.importLibrary('maps') as google.maps.MapsLibrary
    const { AdvancedMarkerElement } = await maps.importLibrary('marker') as google.maps.MarkerLibrary
    const { DirectionsService, DirectionsRenderer } = await maps.importLibrary('routes') as google.maps.RoutesLibrary
    const map = new Map(mapRef.value, {
      mapId: config.public.googleMaps.mapId.raster,
    })
    const directionsService = new DirectionsService()
    const directionsRenderer = new DirectionsRenderer({ suppressMarkers: props.enableMarker })
    directionsRenderer.setMap(map)
    const origin = new google.maps.LatLng(props.positions.start.lat, props.positions.start.lng)
    const destination = new google.maps.LatLng(props.positions.end.lat, props.positions.end.lng)
    const request = {
      origin,
      destination,
      waypoints: props.positions.waypoints
        ? props.positions.waypoints.map(point => ({
            location: new google.maps.LatLng(point.lat, point.lng),
            stopover: true,
          }))
        : [],
      travelMode: google.maps.TravelMode.DRIVING,
    }
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
        if (props.enableMarker) {
          new AdvancedMarkerElement({
            map,
            position: props.positions.start,
          })
          new AdvancedMarkerElement({
            map,
            position: props.positions.end,
          })
        }
      }
    })
  })
})
</script>

<template>
  <div
    ref="mapRef"
    class="w-full aspect-video"
  />
</template>

```

### コンポーネントを呼ぶ側

### 画面表示はこんな感じ

## おわりに

