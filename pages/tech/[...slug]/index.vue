<script setup lang="ts">
import type { BreadcrumbListItem } from "~/types/utilities";
import { useRotate } from "~/composables/utilities/rotate";

const route = useRoute();
const { data } = await useAsyncData(route.path, () =>
  queryCollection("tech").path(route.path).first()
);
const breadcrumbs = computed<BreadcrumbListItem[]>(() => [
  { label: "TOP", route: { name: "index" } },
  {
    label: data.value?.title ?? "記事",
    route: { name: `tech-${route.params.slug}` },
  },
]);
const image = ref<HTMLElement | null>(null);
const { handleScroll } = useRotate(image);
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div>
    <article v-if="data" id="article" class="space-y-12">
      <div class="space-y-4">
        <img
          ref="image"
          :src="data.icon"
          alt=""
          width="160"
          height="160"
          class="mx-auto"
          :style="`view-transition-name: ${data.id.replace(/\W/g, '-')}`"
        />
        <h1 class="font-bold text-xl md:text-3xl">
          {{ data.title }}
        </h1>
        <ul v-if="data.tags" class="flex gap-2 flex-wrap">
          <li v-for="(tag, index) in data.tags" :key="index">
            <p
              class="text-sm border border-gray-400 opacity-80 font-bold rounded-full leading-none py-1 px-2"
            >
              #{{ tag }}
            </p>
          </li>
        </ul>
        <p class="opacity-80 text-sm md:text-base">
          {{ data.description }}
        </p>
        <BreadcrumbList :items="breadcrumbs" />
      </div>
      <ContentRenderer :value="data" class="space-y-8" />
    </article>
    <div v-else>
      <h1>記事が見つかりませんでした</h1>
    </div>
  </div>
</template>
