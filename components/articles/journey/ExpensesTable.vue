<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { getGroupedRowModel } from '@tanstack/vue-table'
import type { GroupingOptions } from '@tanstack/vue-table'
import type { DiaryCollectionItem } from '@nuxt/content'

const props = defineProps<({
  expenses: DiaryCollectionItem['expenses']
})>()

const UBadge = resolveComponent('UBadge')

type Expense = DiaryCollectionItem['expenses'][0]

const getColorByCategory = (category: DiaryCollectionItem['expenses'][0]['category']) => {
  return {
    food: 'success',
    lodging: 'error',
    transport: 'neutral',
    sightseeing: 'neutral',
    other: 'neutral',
  }[category]
}

const columns: TableColumn<Expense>[] = [
  {
    id: 'title',
    header: 'カテゴリー',
  },
  {
    id: 'category',
    accessorKey: 'category',
  },
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) =>
      row.getIsGrouped() ? `${row.getValue('id')} records` : `#`,
    aggregationFn: 'count',
  },
  {
    accessorKey: 'note',
    header: () => h('div', { class: 'whitespace-nowrap' }, 'メモ'),
  },
  {
    accessorKey: 'method',
    header: () => h('div', { class: 'whitespace-nowrap' }, '支払い方法'),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, '金額'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    },
    aggregationFn: 'sum',
  },
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: 'remove',
  getGroupedRowModel: getGroupedRowModel(),
})
</script>

<template>
  <UTable
    :data="props.expenses"
    :columns="columns"
    :grouping="['category']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0',
    }"
  >
    <template #title-cell="{ row }">
      <div
        v-if="row.getIsGrouped()"
        class="flex items-center"
      >
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <UButton
          variant="outline"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'"
          @click="row.toggleExpanded()"
        />
        <UBadge
          :color="getColorByCategory(row.original.category)"
          class="capitalize"
          variant="subtle"
        >
          {{ row.original.category }}
        </UBadge>
      </div>
    </template>
  </UTable>
</template>
