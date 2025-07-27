<script setup lang="ts">
import ExternalLinkCard from '~/components/links/ExternalLinkCard.vue'

defineProps<{
  url: string
  label?: string
}>()
</script>

<template>
  <Suspense>
    <template #default>
      <ExternalLinkCard
        :url="url"
        :label="label"
      />
    </template>
    <template #fallback>
      <NuxtLink
        :to="url"
        target="_blank"
        rel="external noopener noreferrer"
        :aria-label="label"
        class="block"
      >
        <div
          class="group grid grid-cols-[1fr_120px] md:grid-cols-[1fr_240px] gap-x-4 overflow-hidden rounded-xl border border-gray-200 animate-pulse dark:border-gray-800"
        >
          <!-- テキスト部分のスケルトン -->
          <div class="flex flex-col justify-center gap-y-2 py-4 pl-4">
            <USkeleton class="h-4 w-3/4 md:w-1/2 bg-gray-200 dark:bg-gray-700 rounded-sm" />
            <USkeleton class="h-3 w-1/2 md:w-1/3 bg-gray-200 dark:bg-gray-700 rounded-sm" />
          </div>

          <!-- 画像部分のスケルトン -->
          <div>
            <USkeleton class="aspect-video w-[120px] h-full md:w-[240px] bg-gray-200 dark:bg-gray-700 rounded-sm" />
          </div>
        </div>
      </NuxtLink>
    </template>
  </Suspense>
</template>
