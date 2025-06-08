<script setup lang="ts">
import { useGlobMap } from '~/composables/glob-map'

// defineProps<{
//   latitude: number
//   longitude: number
// }>()

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  if (container.value === null) {
    return
  }
  const { render, renderer } = useGlobMap(container)
  if (renderer === undefined) {
    return
  }

  container.value.appendChild(renderer.domElement)
  render()
})
</script>

<template>
  <div
    ref="container"
    class="globe-container"
  />
</template>

<style scoped>
.globe-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  /* position: relative; */
  overflow: hidden;
}
</style>
