<script setup lang="ts">
type Position = { lat: number, lng: number }

const props = defineProps<{
  positions: {
    start: Position
    end: Position
    waypoints: Position[]
  }
}>()

const config = useRuntimeConfig()

const mapRef = ref<HTMLElement | null>(null)

const { onLoaded } = useScriptGoogleMaps({
  apiKey: config.public.scripts.googleMaps.apiKey,
})

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
    waypoints: props.positions.waypoints.map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: true,
    })),
    travelMode: google.maps.TravelMode.DRIVING,
  }

  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)

      new AdvancedMarkerElement({
        map,
        position: props.positions.start,
      })
      new AdvancedMarkerElement({
        map,
        position: props.positions.end,
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
