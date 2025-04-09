<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import { useRotate } from '~/composables/utilities/rotate'

const { data } = await useAsyncData('blog', () =>
  queryCollection('tech')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all(),
)

const image = ref<HTMLElement | null>(null)
const { handleScroll } = useRotate(image)
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="space-y-12">
    <div
      class="grid grid-cols-[160px_auto] items-center gap-x-4 md:gap-x-8 md:grid-cols-[240px_auto]"
    >
      <img
        ref="image"
        src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465747/tsukiyama_cqdytg.png"
        alt=""
        width="160"
        height="160"
        class="border border-gray-200 rounded-full md:w-[240px] md:h-[240px]"
      >
      <div class="w-fit">
        <h2 class="font-bold text-lg md:text-2xl">
          Kohei Tsukiyama
        </h2>
        <p class="text-base md:text-lg">
          Web Enginner
        </p>
        <p class="text-sm md:text-base opacity-80">
          🇯🇵 Tokyo / 1999.10.12
        </p>
        <p class="text-sm md:text-base">
          Vue / Nuxt / CSS が好きです。<br>最近はポケポケと短歌の歌集を読んだりばかりしています。
        </p>
      </div>
    </div>
    <ul class="space-y-8">
      <li
        v-for="article in data"
        :key="article.path"
        class="list-none divide-y divide-gray-300 hover:opacity-70"
      >
        <NuxtLink
          :to="article.path"
          class="grid grid-cols-[120px_1fr] gap-x-4"
        >
          <img
            :src="article.icon"
            alt=""
            width="120"
            height="120"
            class="border border-gray-200 rounded-xl"
            :style="`view-transition-name: ${article.id.replace(/\W/g, '-')}`"
          >
          <div class="space-y-1">
            <h3 class="text-base md:text-xl font-bold">{{ article.title }}</h3>
            <p class="text-sm md:text-base opacity-80">
              {{ article.description }}
            </p>
            <FormattedDate :date="article.date" />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
