<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(route.path, () =>
  queryCollection('tech').path(route.path).first(),
)
</script>

<template>
  <main class="max-w-[800px] mx-auto">
    <article
      v-if="data"
      id="article"
    >
      <h1 class="font-bold text-3xl">
        {{ data.title }}
      </h1>
      <img
        :src="data.ogp"
        alt=""
      >
      <ContentRenderer
        :value="data"
        class="space-y-6"
      />
    </article>
    <div v-else>
      <h1>記事が見つかりませんでした</h1>
    </div>
  </main>
</template>
