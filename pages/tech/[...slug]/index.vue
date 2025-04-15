<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import TocList from '~/components/articles/TocList.vue'
import type { BreadcrumbListItem } from '~/types/utilities'
import { useRotate } from '~/composables/utilities/rotate'
import { useTechArticle } from '~/composables/articles'

const route = useRoute()
const { article } = await useTechArticle(route.path)
if (article.value === null) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

const breadcrumbs = computed<BreadcrumbListItem[]>(() => [
  { label: 'TOP', route: { name: 'index' } },
  {
    label: article.value?.title ?? '記事',
    route: { name: `tech-${route.params.slug}` },
  },
])
const image = ref<HTMLElement | null>(null)
const { handleScroll } = useRotate(image)
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

useSeoMeta({
  title: `${article.value.title}｜tsukiyama.blog`,
  description: article.value.description,
  ogTitle: `${article.value.title}｜tsukiyama.blog`,
  ogDescription: article.value.description,
  ogImage: article.value.ogImage ?? 'https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039369/tsukiyama-blog/tsukiyama.blog_uaoqwg.png',
  ogUrl: `https://tsukiyama.blog/tech/${article.value.id}`,
})
</script>

<template>
  <div>
    <article
      v-if="article"
      id="article"
      class="space-y-8"
    >
      <div class="space-y-4">
        <img
          ref="image"
          :src="article.icon"
          alt=""
          width="160"
          height="160"
          class="mx-auto"
          :style="`view-transition-name: ${article.id.replace(/\W/g, '-')}`"
        >
        <h1 class="font-bold text-xl md:text-3xl">
          {{ article.title }}
        </h1>
        <FormattedDate :date="article.date" />
        <ul
          v-if="article.tags"
          class="flex gap-2 flex-wrap"
        >
          <li
            v-for="(tag, index) in article.tags"
            :key="index"
          >
            <p
              class="text-sm border border-gray-400 opacity-80 font-bold rounded-full leading-none py-1 px-2"
            >
              #{{ tag }}
            </p>
          </li>
        </ul>
        <p class="opacity-80 text-sm md:text-base">
          {{ article.description }}
        </p>
        <BreadcrumbList :items="breadcrumbs" />
      </div>
      <section class="grid gap-8 grid-cols-1 md:grid-cols-[1fr_300px]">
        <main class="w-full order-2 md:order-1">
          <ContentRenderer
            :value="article"
            class="space-y-8"
          />
        </main>
        <aside class="md:sticky order-1 md:top-4 h-fit md:order-2">
          <TocList :toc="article?.body.toc" />
        </aside>
      </section>
    </article>
    <div v-else>
      <h1>記事が見つかりませんでした</h1>
    </div>
  </div>
</template>
