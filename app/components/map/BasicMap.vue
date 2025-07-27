<script setup lang="ts">
type Position = { lat: number, lng: number }

const props = defineProps<{
  position: Position
  zoom?: number
  enableMarker?: boolean
}>()

const config = useRuntimeConfig()

const mapRef = ref<HTMLElement | null>(null)

const { onLoaded } = useScriptGoogleMaps()

onMounted(() => {
  onLoaded(async (instance) => {
    if (!mapRef.value) {
      return
    }

    const maps = await instance.maps
    const { Map } = await maps.importLibrary('maps') as google.maps.MapsLibrary
    const { AdvancedMarkerElement } = await maps.importLibrary('marker') as google.maps.MarkerLibrary

    const map = new Map(mapRef.value, {
      center: props.position,
      zoom: props.zoom ?? 8,
      mapId: config.public.googleMaps.mapId.raster,
    })

    if (props.enableMarker) {
      new AdvancedMarkerElement({
        map,
        position: props.position,
      })
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
