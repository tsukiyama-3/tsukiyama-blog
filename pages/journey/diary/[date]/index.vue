<script setup lang="ts">
import { UAccordion, UBadge, UPage } from '#components'
import ExpensesTable from '~/components/articles/journey/ExpensesTable.vue'
import { useDiaryArticle, useDiarySrroundArticles } from '~/composables/articles/journey/diary'
import { useWeatherIcon } from '~/composables/articles/journey/icon'

const route = useRoute()
const config = useRuntimeConfig()

const { article } = await useDiaryArticle(route.path)
const { surrounds } = await useDiarySrroundArticles(route.path)

type LatLng = { lat: number, lng: number }

const { onLoaded } = useScriptGoogleMaps({
  apiKey: config.public.scripts.googleMaps.apiKey,
})
const mapRef = ref<HTMLElement | null>(null)
onMounted(() => {
  onLoaded(async (instance) => {
    if (!mapRef.value || !article.value) return
    const maps = await instance.maps
    const mapInstance = new maps.Map(mapRef.value, {
      center: getMidPoint({ lat: article.value?.position.start.lat, lng: article.value?.position.start.lng }, article.value?.position.end ? { lat: article.value?.position.end.lat, lng: article.value?.position.end.lng } : undefined),
      zoom: 6,
      disableDefaultUI: true,
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })
    const start = new google.maps.LatLng(article.value.position.start.lat, article.value.position.start.lng)
    const end = article.value.position.end ? new google.maps.LatLng(article.value.position.end.lat, article.value.position.end.lng) : start
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    }
    const directionsService = new maps.DirectionsService()
    const directionsRenderer = new maps.DirectionsRenderer({ suppressMarkers: true })
    directionsRenderer.setMap(mapInstance)
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
        new maps.Marker({
          position: start,
          map: mapInstance,
        })

        // ✅ 自前マーカー追加（到着地点）
        new maps.Marker({
          position: end,
          map: mapInstance,
        })
      }
    })
  })
})
const getMidPoint = (point1: LatLng, point2?: LatLng): LatLng => {
  if (!point2) return point1
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const toDeg = (rad: number) => (rad * 180) / Math.PI

  const lat1 = toRad(point1.lat)
  const lng1 = toRad(point1.lng)
  const lat2 = toRad(point2.lat)
  const lng2 = toRad(point2.lng)

  const dLng = lng2 - lng1

  const bx = Math.cos(lat2) * Math.cos(dLng)
  const by = Math.cos(lat2) * Math.sin(dLng)

  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bx) ** 2 + by ** 2),
  )
  const lng3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx)

  console.log({
    lat: toDeg(lat3),
    lng: ((toDeg(lng3) + 540) % 360) - 180,
  })
  return {
    lat: toDeg(lat3),
    lng: ((toDeg(lng3) + 540) % 360) - 180,
  }
}

const { convertIcon, convertText } = useWeatherIcon()
</script>

<template>
  <UPage
    v-if="article && surrounds"
    :ui="{ center: 'lg:col-span-6 order-3', root: 'mt-0', left: 'lg:col-span-10 order-1', right: 'lg:col-span-4 order-2' }"
    class="dark:text-highlighted"
  >
    <template #left>
      <UPageHeader
        :headline="`Day ${article.day}`"
        :title="article.title"
        :description="article.description"
        :ui="{ headline: 'font-mono' }"
      />
    </template>
    <UPageBody class="lg:mt-0">
      <ContentRenderer
        :value="article"
      />

      <USeparator />

      <UContentSurround :surround="surrounds">
        <template #link-title="surround">
          <div class="space-y-1">
            <UBadge
              size="md"
              variant="subtle"
            >
              Day {{ surround.link.day }}
            </UBadge>
            <h4>
              {{ surround.link.title }}
            </h4>
          </div>
        </template>
      </UContentSurround>
    </UPageBody>
    <template #right>
      <div class="font-mono">
        <UAccordion
          :items="[{ label: '' }]"
          :unmount-on-hide="false"
          class="border border-muted relative"
          :ui="{ trigger: 'pr-2' }"
          default-value="0"
        >
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <template #leading>
            <div class="grid items-center gap-x-2 grid-cols-2 px-2">
              <h2 class="text-muted">
                移動距離
              </h2>
              <p>
                {{ article.distance }}km
              </p>
            </div>
          </template>
          <template #content>
            <div
              ref="mapRef"
              class="w-full aspect-video relative"
            />
          </template>
        </UAccordion>
        <UAccordion
          :items="[{ label: '' }]"
          :unmount-on-hide="false"
          class="border border-muted relative"
          :ui="{ trigger: 'pr-2' }"
        >
          <div>
            <span class="w-[9px] h-[0.5px] block top-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <template #leading>
            <div class="grid items-center grid-cols-2 px-2">
              <h2 class="text-muted">
                基本情報
              </h2>
            </div>
          </template>
          <template #content>
            <ul class="py-2">
              <li class="grid grid-cols-2 px-2 text-sm">
                <h2 class="text-muted">
                  天候
                </h2>
                <div class="flex gap-x-1">
                  <p
                    v-for="(weather, index) in article.weather"
                    :key="index"
                    class="flex items-center gap-x-1"
                  >
                    <UIcon
                      :name="convertIcon(weather)"
                      class="size-4"
                    />
                    {{ convertText(weather) }}
                    <span v-if="index < article.weather.length - 1">/</span>
                  </p>
                </div>
              </li>
              <li class="grid grid-cols-2 px-2 text-sm">
                <h2 class="text-muted">
                  気温
                </h2>
                <div>
                  <p>最高: {{ article.temperature.high }}℃</p>
                  <p>最低: {{ article.temperature.low }}℃</p>
                </div>
              </li>
              <li class="grid grid-cols-2 px-2 text-sm">
                <h2 class="text-muted">
                  所持金
                </h2>
                <div>
                  <p
                    v-for="(cash, currency) in article.cash"
                    :key="currency"
                  >
                    {{ currency }}:{{ cash }}
                  </p>
                </div>
              </li>
            </ul>
          </template>
        </UAccordion>
        <UAccordion
          :items="[{ label: '' }]"
          class="border border-muted relative"
          :ui="{ trigger: 'pr-2' }"
        >
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <template #leading>
            <div class="flex items-center gap-x-2 px-2">
              <h2 class="text-muted">
                出費
              </h2>
              <UBadge
                size="md"
                color="error"
                variant="subtle"
              >
                - $100
              </UBadge>
            </div>
          </template>
          <template #content>
            <ExpensesTable :expenses="article.expenses" />
          </template>
        </UAccordion>
        <UAccordion
          :items="[{ label: '' }]"
          class="border border-muted relative"
          :ui="{ trigger: 'pr-2' }"
        >
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] left-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] left-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block top-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block top-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <div>
            <span class="w-[9px] h-[1px] block bottom-[-1px] right-[-5px] dark:bg-white bg-black absolute" />
            <span class="w-[1px] h-[9px] block bottom-[-5px] right-[-1px] dark:bg-white bg-black absolute" />
          </div>
          <template #leading>
            <div class="flex items-center gap-x-2 px-2">
              <h2 class="text-muted">
                収入
              </h2>
              <UBadge
                size="md"
                variant="subtle"
              >
                + $100
              </UBadge>
            </div>
          </template>
          <template #content>
            <ExpensesTable :expenses="article.expenses" />
          </template>
        </UAccordion>
      </div>
    </template>
  </UPage>
</template>

<style scoped>
:deep(h2:first-of-type) {
  margin-top: 0;
}
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  scroll-margin-top: 80px;
}
</style>
