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
    <div class="space-y-12">
      <section class="space-y-6">
        <hgroup class="space-y-2">
          <h2 class="dark:text-highlighted text-3xl font-bold">
            Diary
          </h2>
          <p class="text-muted">
            日々の出来事を書き綴っています。
          </p>
        </hgroup>
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
      </section>
      <section class="space-y-6">
        <hgroup class="space-y-2">
          <h2 class="dark:text-highlighted text-3xl font-bold">
            Tips
          </h2>
          <p class="text-muted">
            旅で役立つ情報をまとめています。
          </p>
        </hgroup>
      </section>
      <section class="space-y-6">
        <hgroup class="space-y-2">
          <h2 class="dark:text-highlighted text-3xl font-bold">
            Photos
          </h2>
          <p class="text-muted">
            旅中に撮った写真。
          </p>
        </hgroup>
      </section>
    </div>
  </UPage>
</template>
