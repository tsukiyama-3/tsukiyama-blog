<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import { useTechArticles } from '~/composables/articles'
import { useTag } from '~/composables/utilities/tag'

const { articles } = await useTechArticles()
const { convertSvgLogo } = useTag()
</script>

<template>
  <UPage>
    <div class="space-y-6">
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
      <section class="space-y-6">
        <h2 class="text-xl text-center">
          新着記事
        </h2>
        <ul class="grid md:grid-cols-2 gap-4">
          <li
            v-for="article in articles"
            :key="article.path"
            class="list-none divide-y divide-gray-300 hover:opacity-70"
          >
            <NuxtLink
              :to="article.path"
            >
              <article class="grid grid-cols-[120px_1fr] gap-x-4">
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
                      <UBadge
                        color="neutral"
                        variant="outline"
                      >
                        <UIcon
                          v-if="convertSvgLogo(tag)"
                          :name="convertSvgLogo(tag)"
                          class="size-3"
                        />
                        <p>
                          {{ tag }}
                        </p>
                      </UBadge>
                    </li>
                  </ul>
                  <FormattedDate :date="article.date" />
                </div>
              </article>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </UPage>
</template>
