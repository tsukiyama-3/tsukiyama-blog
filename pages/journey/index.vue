<script setup lang="ts">
import GlobeMaker from '~/components/globe/GlobeMaker.vue'
import { useDiaryArticles } from '~/composables/articles/journey/diary'

const { articles } = await useDiaryArticles()
</script>

<template>
  <UPage>
    <div class="grid md:grid-cols-2">
      <h1>Journey</h1>
      <GlobeMaker />
    </div>
    <UBlogPosts
      orientation="vertical"
      class="gap-4 lg:gap-4"
    >
      <UBlogPost
        v-for="(article, index) in articles"
        :key="index"
        v-bind="article"
        orientation="vertical"
        :to="article.path"
        :badge="{
          label: `Day ${article.day}`,
          color: 'primary',
          variant: 'subtle',
        }"
        :ui="{ badge: 'font-mono', date: 'font-mono' }"
      />
    </UBlogPosts>
  </UPage>
</template>
