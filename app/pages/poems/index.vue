<script setup lang="ts">
import { usePoems } from '~/composables/poems'

definePageMeta({ layout: 'poem' })

const { poems } = await usePoems()
</script>

<template>
  <div class="font-noto-serif space-y-4">
    <p>Let's poem!</p>
    <ul>
      <li
        v-for="poem in poems"
        :key="poem.path"
        class="list-disc mx-4"
      >
        <NuxtLink
          :to="poem.path"
          class="flex items-center text-sm gap-x-2 text-secondary hover:underline"
        >
          <h2>{{ poem.title }}</h2>
          <time
            datetime="poem.date"
            class="opacity-80"
          >{{ poem.date }}</time>
        </NuxtLink>
      </li>
    </ul>
    <p>Nice poem!</p>
  </div>
</template>
