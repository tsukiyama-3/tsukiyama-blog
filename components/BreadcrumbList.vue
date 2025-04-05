<script setup lang="ts">
import type { BreadcrumbListItem } from '~/utils/types'

const { items } = defineProps<{
  items: BreadcrumbListItem[]
}>()
</script>

<template>
  <div
    class="scrollbar-none mx-auto max-w-[1168px] overflow-x-auto py-2 md:py-2.5"
  >
    <ol class="flex whitespace-nowrap">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex place-items-center"
      >
        <NuxtLink
          v-if="index !== items.length - 1"
          :to="item.route"
          class="text-sm text-blue-500 md:text-base"
        >
          <span itemprop="name">{{ item.label }}</span>
        </NuxtLink>
        <Icon
          v-if="index !== items.length - 1"
          name="mynaui:chevron-right"
          class="text-gray-800"
          width="20"
          height="20"
        />
        <span
          v-if="index === items.length - 1"
          class="pr-4 text-sm md:text-base"
        >{{ item.label }}</span>
        <meta
          itemprop="position"
          :content="String(index + 1)"
        >
      </li>
    </ol>
  </div>
</template>
