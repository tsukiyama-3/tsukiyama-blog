<script setup lang="ts">
const { data } = await useAsyncData('blog', () =>
  queryCollection('tech').order('id', 'DESC').all(),
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Index
    </h1>
    <div>
      <li
        v-for="article in data"
        :key="article.path"
        class="list_item"
      >
        <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
      </li>
    </div>
  </div>
</template>
