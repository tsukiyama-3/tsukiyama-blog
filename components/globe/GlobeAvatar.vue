<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <div class="relative inline-block w-8 h-8">
    <span class="absolute inset-0 z-0 flex">
      <span class="absolute h-full w-full animate-ping rounded-full bg-primary opacity-75" />
      <span class="relative h-full w-full rounded-full bg-primary" />
    </span>

    <UAvatar
      size="sm"
      :src="src"
      class="relative z-10 w-full h-full"
    />
  </div>
</template>
