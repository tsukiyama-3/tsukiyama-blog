<script setup lang="ts">
const props = defineProps<{
  date: string | Date;
}>();

const formattedDate = computed(() => {
  const dateObj =
    props.date instanceof Date ? props.date : new Date(props.date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return `${year}/${month}/${day}`;
});
</script>

<template>
  <p class="text-sm opacity-80">
    <time :datetime="date.toString()">
      {{ formattedDate }}
    </time>
  </p>
</template>
