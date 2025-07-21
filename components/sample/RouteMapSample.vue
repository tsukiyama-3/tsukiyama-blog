<script setup lang="ts">
const props = {
  positions: {
    start: { lat: 35.690921, lng: 139.70025799999996 },
    end: { lat: 35.690921, lng: 139.70025799999996 },
  },
  waypoints: [
    { lat: 35.683061, lng: 139.702042 }, // 代々木
    { lat: 35.670168, lng: 139.70268699999997 }, // 原宿
    { lat: 35.658517, lng: 139.70133399999997 }, // 渋谷
    { lat: 35.64669, lng: 139.710106 }, // 恵比寿
    { lat: 35.633998, lng: 139.715828 }, // 目黒
    { lat: 35.626446, lng: 139.72344399999997 }, // 五反田
    { lat: 35.6197, lng: 139.72855300000003 }, // 大崎
    { lat: 35.630152, lng: 139.74044000000004 }, // 品川
    { lat: 35.645736, lng: 139.74757499999998 }, // 田町
    { lat: 35.655646, lng: 139.756749 }, // 浜松町
    { lat: 35.665498, lng: 139.75964 }, // 新橋
    { lat: 35.675069, lng: 139.763328 }, // 有楽町
    { lat: 35.681382, lng: 139.76608399999998 }, // 東京
    { lat: 35.69169, lng: 139.77088300000003 }, // 神田
    { lat: 35.698683, lng: 139.77421900000002 }, // 秋葉原
    { lat: 35.707438, lng: 139.774632 }, // 御徒町
    { lat: 35.713768, lng: 139.77725399999997 }, // 上野
    { lat: 35.727772, lng: 139.770987 }, // 日暮里
    { lat: 35.738062, lng: 139.76085999999998 }, // 田端
    { lat: 35.733492, lng: 139.73934499999996 }, // 巣鴨
    { lat: 35.731401, lng: 139.72866199999999 }, // 大崎
    { lat: 35.728926, lng: 139.71038 }, // 池袋
    { lat: 35.721204, lng: 139.706587 }, // 目白
    { lat: 35.712285, lng: 139.70378200000005 }, // 高田馬場
    { lat: 35.701306, lng: 139.706587 }, // 新大久保
  ],
}
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
    const { DirectionsService, DirectionsRenderer } = await maps.importLibrary('routes') as google.maps.RoutesLibrary
    const map = new Map(mapRef.value, {
      mapId: config.public.googleMaps.mapId.raster,
    })
    const directionsService = new DirectionsService()
    const directionsRenderer = new DirectionsRenderer()
    directionsRenderer.setMap(map)
    const origin = new google.maps.LatLng(props.positions.start.lat, props.positions.start.lng)
    const destination = new google.maps.LatLng(props.positions.end.lat, props.positions.end.lng)
    const request = {
      origin,
      destination,
      waypoints: props.waypoints
        ? props.waypoints.map(point => ({
            location: new google.maps.LatLng(point.lat, point.lng),
            stopover: true,
          }))
        : [],
      travelMode: google.maps.TravelMode.DRIVING,
    }
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
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
