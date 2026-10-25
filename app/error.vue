<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const displayError = computed(() => props.error.statusCode === 404
  ? {
      statusCode: 404,
      statusMessage: 'ページが見つかりません',
      message: 'お探しのページは削除されたか、URL が間違っている可能性があります。',
    }
  : {
      statusCode: props.error.statusCode,
      statusMessage: 'エラーが発生しました',
      message: 'しばらく時間をおいてから再度お試しください。',
    })

useSeoMeta({
  title: `${displayError.value.statusMessage}｜tsukiyama.blog`,
  robots: 'noindex',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UError
        as="div"
        :error="displayError"
        :clear="{ label: 'TOPへ戻る' }"
        :ui="{ root: 'min-h-[60vh]' }"
      />
    </NuxtLayout>
  </UApp>
</template>
