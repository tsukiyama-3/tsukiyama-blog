<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import { useTechArticles } from '~/composables/articles'

const { articles } = await useTechArticles()
</script>

<template>
  <UPage>
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
          <div class="flex gap-x-2">
            <p class="text-sm md:text-base opacity-80 flex items-center gap-x-2">
              <UIcon
                name="flag:jp-4x3"
                class="size-5 border border-gray-200"
              />
              Tokyo
            </p>
            /
            <p class="text-sm md:text-base opacity-80 flex items-center gap-x-2">
              <UIcon
                name="emojione:birthday-cake"
                class="size-5"
              /> 1999.10.12
            </p>
          </div>
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
  </UPage>
</template>
