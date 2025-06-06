<script setup lang="ts">
const props = defineProps<{
  url: string
  label?: string
}>()

const isVisible = ref(false)
const el = ref<HTMLElement>()

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { rootMargin: '100px' },
  )

  if (el.value) {
    observer.observe(el.value)
  }
})
</script>

<template>
  <div ref="el">
    <Suspense>
      <template #default>
        <component
          :is="
            isVisible
              ? defineAsyncComponent(() => import('./ExternalLinkCard.vue'))
              : 'div'
          "
          v-bind="props"
        />
      </template>
      <template #fallback>
        <div class="h-[100px] w-full animate-pulse rounded-xl bg-gray-100" />
      </template>
    </Suspense>
  </div>
</template>
