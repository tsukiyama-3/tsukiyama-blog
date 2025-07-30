<script setup lang="ts">
import { useGeoLocation } from '~/composables/articles/sample/geolocation-api'

const { position, getPosition } = useGeoLocation()
</script>

<template>
  <div class="space-y-2">
    <ul class="space-y-2">
      <li>緯度：{{ position?.coords.latitude }}</li>
      <li>軽度：{{ position?.coords.longitude }}</li>
    </ul>
    <UButton
      class="w-fit block mx-auto cursor-pointer"
      @click="getPosition"
    >
      位置情報を取得する
    </UButton>
  </div>
</template>
