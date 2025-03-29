<script setup lang="ts">
const { data } = await useAsyncData("blog", () =>
  queryCollection("tech")
    .where("published", "=", true)
    .order("id", "DESC")
    .all()
);
</script>

<template>
  <div>
    <h1>Index</h1>
    <p>{{ data }}</p>
  </div>
</template>
