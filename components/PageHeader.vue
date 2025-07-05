<script setup lang="ts">
import { useRotate } from '~/composables/utilities/rotate'

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
  <UHeader :toggle="false">
    <template #title>
      <hgroup class="flex items-center gap-x-2">
        <img
          ref="image"
          src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465747/tsukiyama_cqdytg.png"
          alt="Kohei Tsukiyama Icon"
          width="32"
          height="32"
          class="border border-gray-200 rounded-full md:w-[32px] md:h-[32px] dark:border-gray-800"
        >
        <h1 class="font-bold md:text-lg">
          tsukiyama.blog
        </h1>
      </hgroup>
    </template>
    <template #right>
      <UColorModeButton />
      <UTooltip
        text="Open on X"
      >
        <UButton
          color="neutral"
          variant="ghost"
          to="https://x.com/tsuyakima3"
          target="_blank"
          icon="i-simple-icons-x"
          aria-label="X"
        />
      </UTooltip>
      <UTooltip
        text="Open on GitHub"
      >
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/tsukiyama-3/tsukiyama-blog"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
