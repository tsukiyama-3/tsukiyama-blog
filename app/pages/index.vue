<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import { useTechArticles } from '~/composables/articles'
import { useProfile } from '~/composables/configurations/profile'
import { useTag } from '~/composables/utilities/tag'

const { articles } = await useTechArticles()
const { convertSvgLogo } = useTag()
const { profile, displayName, displayBirthDate } = await useProfile()
</script>

<template>
  <UPage>
    <div class="space-y-6">
      <div
        class="grid grid-cols-[120px_auto] items-center gap-x-4 md:gap-x-8 md:grid-cols-[240px_auto]"
      >
        <NuxtPicture
          provider="cloudinary"
          :src="profile?.avatar"
          sizes="480px md:240w lg:480w"
          alt="Kohei Tsukiyama Icon"
          width="120"
          height="120"
          format="avif,webp"
          :img-attrs="{
            class: 'border border-gray-200 rounded-full aspect-square md:w-[240px] md:h-[240px] dark:border-gray-800',
          }"
        />
        <NuxtPicture
          provider="cloudinary"
          :src="profile?.avatar"
          den
          sizes="120px md:240w"
          alt=""
          densities="x1 x2 x3"
          width="120"
          height="120"
          format="avif,webp"
          :img-attrs="{
            class: 'border border-gray-200 rounded-full aspect-square md:w-[240px] md:h-[240px] dark:border-gray-800',
          }"
        />
        <div class="w-fit space-y-0.5 md:space-y-1 lg:space-y-2">
          <h2 class="font-bold text-lg md:text-2xl dark:text-highlighted">
            {{ displayName }}
          </h2>
          <p class="text-base md:text-lg dark:text-highlighted">
            {{ profile?.bio }}
          </p>
          <div class="flex gap-x-2 dark:text-highlighted">
            <p class="text-sm md:text-base opacity-80 flex items-center gap-x-2">
              <UIcon
                name="flag:jp-4x3"
                class="size-5 border border-gray-200 dark:border-0"
              />
              {{ profile?.birthPlace.prefecture.toUpperCase() }}
            </p>
            /
            <p class="text-sm md:text-base opacity-80 flex items-center gap-x-2">
              <UIcon
                name="emojione:birthday-cake"
                class="size-5"
              /> {{ displayBirthDate }}
            </p>
          </div>
        </div>
      </div>
      <section class="space-y-6">
        <h2 class="text-xl text-center dark:text-highlighted">
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
              <article class="grid grid-cols-[80px_1fr] gap-x-4 md:grid-cols-[120px_1fr]">
                <NuxtImg
                  provider="cloudinary"
                  :src="article.icon"
                  sizes="240px md:160w lg:240w"
                  format="avif"
                  alt=""
                  width="120"
                  height="120"
                  class="border border-gray-200 rounded-xl dark:border-gray-800 md:w-[120px] md:h-[120px]"
                  :style="`view-transition-name: ${article.id.replace(/\W/g, '-')}`"
                />
                <div class="space-y-1">
                  <h3 class="text-base md:text-xl font-bold dark:text-highlighted">{{ article.title }}</h3>
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
