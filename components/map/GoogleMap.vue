<script setup lang="ts">
type Position = { lat: number, lng: number }

const props = defineProps<{
  position: Position
  enableMarker?: boolean
}>()

const config = useRuntimeConfig()

const mapRef = ref<HTMLElement | null>(null)

const { onLoaded } = useScriptGoogleMaps({
  apiKey: config.public.scripts.googleMaps.apiKey,
})

onLoaded(async (instance) => {
  const maps = await instance.maps
  const { Map } = await maps.importLibrary('maps') as google.maps.MapsLibrary

  // 'marker' ライブラリから AdvancedMarkerElement を取り出し、型を明示
  const { AdvancedMarkerElement } = await maps.importLibrary('marker') as google.maps.MarkerLibrary

  const map = new Map(mapRef.value!, {
    center: props.position,
    zoom: 16,
    tilt: 90,
    heading: 0,
    // mapId: '4dd6c17f0750a29aa8d88c90', // ベクター
    mapId: '4dd6c17f0750a29a89cda4c8', // ラスター
  })

  if (props.enableMarker) {
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
