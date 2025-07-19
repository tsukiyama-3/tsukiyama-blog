<script setup lang="ts">
import GlobeMaker from '~/components/globe/GlobeMaker.vue'
import { useDiaryArticles } from '~/composables/articles/journey/diary'
import { useProfile } from '~/composables/profile'

const { profile } = await useProfile()
const { articles, totalDistance, localTime, localOffset } = await useDiaryArticles()
</script>

<template>
  <UPage
    v-if="articles"
    :ui="{
      center: 'space-y-8 sm:space-y-0',
    }"
  >
    <div class="grid md:grid-cols-2 items-center">
      <div class="space-y-4 sm:space-y-8 order-2 sm:order-1">
        <h1 class="text-xl text-center sm:text-4xl text-pretty font-bold text-highlighted font-mono">
          Around the World by Bicycle
        </h1>
        <div class="text-base sm:text-xl py-4 font-mono dark:text-highlighted flex justify-center">
          <ul class="grid grid-cols-[max-content_1ch_auto] gap-x-2 gap-y-1 w-fit">
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">NAME</span>
              <span class="text-muted">:</span>
              <span v-if="profile.name">{{ profile?.name.toUpperCase() }}</span>
            </li>
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">AGE</span>
              <span class="text-muted">:</span>
              <span>{{ profile?.age }}</span>
            </li>
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">ORIGIN</span>
              <span class="text-muted">:</span>
              <span>{{ profile?.origin }}</span>
            </li>
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">LOCATION</span>
              <span class="text-muted">:</span>
              <span>{{ articles[0].position.end?.label }}</span>
            </li>
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">LOCAL TIME</span>
              <span class="text-muted">:</span>
              <span>{{ localTime }} ({{ localOffset }})</span>
            </li>
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">TOTAL DISTANCE</span>
              <span class="text-muted">:</span>
              <span>{{ totalDistance }} km</span>
            </li>
            <li class="contents grid-cols-subgrid">
              <span class="text-muted">COUNTRIES VISITED</span>
              <span class="text-muted">:</span>
              <span>🇺🇸 United States</span>
            </li>
          </ul>
        </div>
      </div>
      <GlobeMaker class="order-1 sm:order-2" />
    </div>
    <div class="space-y-12">
      <section class="space-y-6">
        <hgroup class="space-y-2">
          <h2 class="dark:text-highlighted text-3xl font-bold font-mono">
            Diary
          </h2>
          <p class="text-muted">
            日々の出来事を書き綴っています
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
          <h2 class="dark:text-highlighted text-3xl font-bold font-mono">
            Tips
          </h2>
          <p class="text-muted">
            旅で役立つ情報など
          </p>
        </hgroup>
      </section>
      <section class="space-y-6">
        <hgroup class="space-y-2">
          <h2 class="dark:text-highlighted text-3xl font-bold font-mono">
            Photos
          </h2>
          <p class="text-muted">
            旅中に撮った写真
          </p>
        </hgroup>
      </section>
    </div>
  </UPage>
</template>
