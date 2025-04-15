<script setup lang="ts">
import type { TechCollectionItem } from '@nuxt/content'

defineProps<{
  toc: TechCollectionItem['body']['toc']
}>()
</script>

<template>
  <nav
    v-if="toc"
    class="border border-gray-200 p-4 rounded-xl space-y-4"
    aria-label="目次"
  >
    <h3>目次</h3>
    <ul class="text-sm text-gray-700 space-y-2">
      <li
        v-for="link in toc.links"
        :key="link.id"
      >
        <NuxtLink
          :to="`#${link.id}`"
          class="hover:underline"
        >
          <p>
            {{ link.text }}
          </p>
        </NuxtLink>

        <!-- 子要素がある場合は ul をもう一段表示 -->
        <ul
          v-if="link.children && link.children.length"
          class="pl-4 mt-1 space-y-1"
        >
          <li
            v-for="child in link.children"
            :key="child.id"
          >
            <NuxtLink
              :to="`#${child.id}`"
              class="hover:underline"
            >
              <p>
                {{ child.text }}
              </p>
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
