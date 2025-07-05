<script setup lang="ts">
import FormattedDate from '~/components/text/FormattedDate.vue'
import type { BreadcrumbListItem } from '~/types/utilities'
import { useTag } from '~/composables/utilities/tag'
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

const { convertSvgLogo } = useTag()

useHead({
  link: [{ rel: 'canonical', href: `https://tsukiyama.blog/tech/${article.value.id}` }],
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
            <UBadge
              color="neutral"
              variant="outline"
            >
              <UIcon
                v-if="convertSvgLogo(tag)"
                :name="convertSvgLogo(tag)"
                class="size-5"
              />
              <p>
                {{ tag }}
              </p>
            </UBadge>
          </li>
        </ul>
        <p class="opacity-80 text-sm md:text-base">
          {{ article.description }}
        </p>
        <BreadcrumbList :items="breadcrumbs" />
      </div>
      <section class="grid gap-8 grid-cols-1 md:grid-cols-[1fr_300px]">
        <main class="w-full max-w-[836px] order-2 md:order-1">
          <ContentRenderer
            :value="article"
            class="space-y-8"
          />
        </main>
        <aside class="md:sticky order-1 md:top-8 h-fit md:order-2">
          <UContentToc
            title="目次"
            :links="article?.body?.toc?.links"
          />
        </aside>
      </section>
    </article>
    <div v-else>
      <h1>記事が見つかりませんでした</h1>
    </div>
  </div>
</template>
