<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import { useTechArticles } from '~/composables/articles'

const { articles } = await useTechArticles()
</script>

<template>
  <div class="space-y-12">
    <div
      class="grid grid-cols-[144px_auto] items-center gap-x-4 md:gap-x-8 md:grid-cols-[240px_auto]"
    >
      <img
        src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465747/tsukiyama_cqdytg.png"
        alt="Kohei Tsukiyama Icon"
        width="144"
        height="144"
        class="border border-gray-200 rounded-full md:w-[240px] md:h-[240px]"
      >
      <div class="w-fit">
        <h2 class="font-bold text-lg md:text-2xl">
          Kohei Tsukiyama
        </h2>
        <p class="text-base md:text-lg">
          Web Enginner
        </p>
        <p class="text-sm md:text-base opacity-80">
          🇯🇵 Tokyo / 1999.10.12
        </p>
        <ul class="flex items-center gap-x-1 mt-1 md:mt-2">
          <li class="leading-none opacity-80">
            <NuxtLink
              to="https://x.com/tsuyakima3"
              target="_blank"
              aria-label="X Link"
              class="hover:opacity-60"
            >
              <Icon
                name="mynaui:brand-x"
                class="text-gray-800 text-2xl md:text-3xl"
                width="24"
                height="24"
              />
            </NuxtLink>
          </li>
          <li class="leading-none opacity-80">
            <NuxtLink
              to="https://github.com/tsukiyama-3"
              target="_blank"
              aria-label="GitHub Link"
              class="hover:opacity-60"
            >
              <Icon
                name="mynaui:brand-github"
                class="text-gray-800 text-2xl md:text-3xl"
                width="24"
                height="24"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <ul class="space-y-8">
      <li
        v-for="article in articles"
        :key="article.path"
        class="list-none divide-y divide-gray-300 hover:opacity-70"
      >
        <NuxtLink
          :to="article.path"
          class="grid grid-cols-[120px_1fr] gap-x-4"
        >
          <img
            :src="article.icon"
            alt=""
            width="120"
            height="120"
            class="border border-gray-200 rounded-xl"
            :style="`view-transition-name: ${article.id.replace(/\W/g, '-')}`"
          >
          <div class="space-y-1">
            <h3 class="text-base md:text-xl font-bold">{{ article.title }}</h3>
            <ul
              v-if="article.tags"
              class="flex gap-1 flex-wrap"
            >
              <li
                v-for="(tag, index) in article.tags"
                :key="index"
              >
                <p
                  class="text-xs border border-gray-400 opacity-80 font-bold rounded-full leading-none py-1 px-2 md:text-sm"
                >
                  #{{ tag }}
                </p>
              </li>
            </ul>
            <FormattedDate :date="article.date" />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
