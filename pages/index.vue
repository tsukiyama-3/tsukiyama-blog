<script setup lang="ts">
import { NuxtLink } from '#components'
import GoogleMap from '~/components/map/GoogleMap.vue'
import FormattedDate from '~/components/text/FormattedDate.vue'
import { useTechArticles } from '~/composables/articles'
import { useTag } from '~/composables/utilities/tag'

const { articles } = await useTechArticles()
const { convertSvgLogo } = useTag()
const config = useRuntimeConfig()
const { onLoaded } = useScriptGoogleMaps({
  apiKey: config.public.scripts.googleMaps.apiKey,
})
const map = ref<HTMLElement | null>(null)
onMounted(() => {
  onLoaded(async (instance) => {
    if (!map.value) return
    const maps = await instance.maps
    const mapInstance = new maps.Map(map.value, {
      center: { lat: 35.4047, lng: 139.4516 },
      zoom: 12,
      disableDefaultUI: true,
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })
    const tokyo = new google.maps.LatLng(24.1426, -110.3127)
    const osaka = new google.maps.LatLng(25.79, -109.00)
    // const gifu = new google.maps.LatLng(35.4233, 136.7607)
    const request = {
      origin: tokyo,
      destination: osaka,
      // waypoints: [
      //   {
      //     location: gifu,
      //     stopover: true,
      //   },
      // ],
      travelMode: google.maps.TravelMode.DRIVING,
    }
    const directionsService = new maps.DirectionsService()
    const directionsRenderer = new maps.DirectionsRenderer({ suppressMarkers: true })
    directionsRenderer.setMap(mapInstance)
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
        new maps.Marker({
          position: tokyo,
          map: mapInstance,
        })

        // ✅ 自前マーカー追加（到着地点）
        new maps.Marker({
          position: osaka,
          map: mapInstance,
        })
      }
    })
  })
})
</script>

<template>
  <UPage>
    <div class="space-y-6">
      <GoogleMap
        :position="{ lat: 35.4047, lng: 139.4516 }"
        :enable-marker="true"
      />
      <div
        class="grid grid-cols-[120px_auto] items-center gap-x-4 md:gap-x-8 md:grid-cols-[240px_auto]"
      >
        <img
          src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465747/tsukiyama_cqdytg.png"
          alt="Kohei Tsukiyama Icon"
          width="120"
          height="120"
          class="border border-gray-200 rounded-full md:w-[240px] md:h-[240px] dark:border-gray-800"
        >
        <div class="w-fit">
          <h2 class="font-bold text-lg md:text-2xl dark:text-highlighted">
            Kohei Tsukiyama
          </h2>
          <p class="text-base md:text-lg dark:text-highlighted">
            Web Enginner
          </p>
          <div class="flex gap-x-2 dark:text-highlighted">
            <p class="text-sm md:text-base opacity-80 flex items-center gap-x-2">
              <UIcon
                name="flag:jp-4x3"
                class="size-5 border border-gray-200 dark:border-0"
              />
              Tokyo
            </p>
            /
            <p class="text-sm md:text-base opacity-80 flex items-center gap-x-2">
              <UIcon
                name="emojione:birthday-cake"
                class="size-5"
              /> 1999.10.12
            </p>
          </div>
        </div>
      </div>
      <section class="space-y-6">
        <h2 class="text-xl text-center dark:text-highlighted">
          新着記事
        </h2>
        <NuxtLink
          to="/journey"
          class="dark:text-highlighted"
        >Journey</NuxtLink>
        <ul class="grid md:grid-cols-2 gap-4">
          <li
            v-for="article in articles"
            :key="article.path"
            class="list-none divide-y divide-gray-300 hover:opacity-70"
          >
            <NuxtLink
              :to="article.path"
            >
              <article class="grid grid-cols-[80px_1fr] gap-x-4 md:grid-cols-[120px_1fr]">
                <img
                  :src="article.icon"
                  alt=""
                  width="80"
                  height="80"
                  class="border border-gray-200 rounded-xl dark:border-gray-800 md:w-[120px] md:h-[120px]"
                  :style="`view-transition-name: ${article.id.replace(/\W/g, '-')}`"
                >
                <div class="space-y-1">
                  <h3 class="text-base md:text-xl font-bold dark:text-highlighted">{{ article.title }}</h3>
                  <ul
                    v-if="article.tags"
                    class="flex gap-1 flex-wrap"
                  >
                    <li
                      v-for="(tag, index) in article.tags"
                      :key="index"
                    >
                      <UBadge
                        color="neutral"
                        variant="outline"
                      >
                        <UIcon
                          v-if="convertSvgLogo(tag)"
                          :name="convertSvgLogo(tag)"
                          class="size-3"
                        />
                        <p>
                          {{ tag }}
                        </p>
                      </UBadge>
                    </li>
                  </ul>
                  <FormattedDate :date="article.date" />
                </div>
              </article>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </UPage>
</template>
