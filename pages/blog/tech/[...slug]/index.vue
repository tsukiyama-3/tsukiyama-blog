<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(route.path, () =>
  queryCollection('tech').path(route.path).first(),
)
</script>

<template>
  <main class="article">
    <article
      v-if="data"
      id="article"
    >
      <h1 class="title">
        {{ data.title }}
      </h1>
      <img
        :src="data.ogp"
        alt=""
      >
      <ContentRenderer :value="data" />
    </article>
    <div v-else>
      <h1>記事が見つかりませんでした</h1>
    </div>
  </main>
</template>

<style scoped src="~/assets/css/tailwind.css"></style>
