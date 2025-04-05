<script setup lang="ts">
const props = defineProps<{
  url: string
  label?: string
}>()

const { data } = await useFetch('/api/ogp', {
  params: {
    url: props.url,
  },
})
</script>

<template>
  <NuxtLink
    :to="url"
    target="_blank"
    rel="external noopener noreferrer"
    :aria-label="label"
    class="block"
  >
    <div
      class="group grid grid-cols-[1fr_120px] md:grid-cols-[1fr_240px] gap-x-4 overflow-hidden rounded-xl border border-gray-200 transition-opacity hover:opacity-60"
    >
      <div class="flex flex-col justify-center gap-y-2 py-4 pl-4">
        <p
          class="line-clamp-2 wrap-anywhere text-sm font-bold text-gray-800 md:text-lg"
        >
          {{ data?.title }}
        </p>
        <p class="text-xs wrap-anywhere text-gray-800 opacity-80 md:text-sm">
          {{ url }}
        </p>
      </div>
      <img
        :src="data?.image"
        class="aspect-video w-[120px] object-cover md:w-[240px] h-full"
        width="120"
        height="68"
        loading="lazy"
      >
    </div>
  </NuxtLink>
</template>
