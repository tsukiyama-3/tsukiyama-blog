<script setup lang="ts" generic="T extends ZodTypeAny">
import type { ZodTypeAny, z } from 'zod'

type Props<T extends ZodTypeAny> = {
  schema: T
  state: Partial<z.infer<T>>
}

const props = defineProps<Props<T>>()
const emit = defineEmits<{ submit: [] }>()

const parsed = computed(() => {
  return props.schema.safeParse(props.state)
})

const errors = computed(() => {
  if (parsed.value.success) {
    return {}
  }
  return Object.fromEntries(
    parsed.value.error.issues.map((issue) => {
      const key = issue.path[0]?.toString()
      return key ? [key, issue.message] : null
    }).filter(Boolean) as [string, string][],
  )
})
</script>

<template>
  <form
    class="dark:text-highlighted"
    @submit.prevent="emit('submit')"
  >
    <slot :errors="errors" />
  </form>
</template>
