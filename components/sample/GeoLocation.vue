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
