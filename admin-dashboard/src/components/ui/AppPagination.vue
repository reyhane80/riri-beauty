<script setup>
import { computed } from 'vue'
import { formatNumber } from '@/utils/format'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['update:page'])

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.page * props.pageSize, props.total))

/** شماره صفحات با «…» برای تعداد زیاد صفحه */
const pages = computed(() => {
  const count = pageCount.value
  const current = props.page
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const result = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(count - 1, current + 1)
  if (start > 2) result.push('…')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < count - 1) result.push('…')
  result.push(count)
  return result
})

const go = (p) => {
  if (p >= 1 && p <= pageCount.value && p !== props.page) emit('update:page', p)
}
</script>

<template>
  <nav class="flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="صفحه‌بندی">
    <p class="tabular text-sm text-slate-500 dark:text-slate-400">
      نمایش {{ formatNumber(from) }} تا {{ formatNumber(to) }} از {{ formatNumber(total) }} مورد
    </p>
    <div class="flex items-center gap-1">
      <!-- در چیدمان راست‌به‌چپ، «قبلی» سمت راست است -->
      <button type="button" class="icon-btn size-9 disabled:pointer-events-none disabled:opacity-40" :disabled="page === 1" aria-label="صفحه قبل" @click="go(page - 1)">
        <BaseIcon name="chevron-right" class="size-4" />
      </button>
      <template v-for="(p, i) in pages" :key="`${p}-${i}`">
        <span v-if="p === '…'" class="px-1 text-slate-400">…</span>
        <button
          v-else
          type="button"
          :class="[
            'tabular min-w-9 rounded-lg px-2 py-1.5 text-sm font-medium transition',
            p === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
          ]"
          :aria-current="p === page ? 'page' : undefined"
          @click="go(p)"
        >
          {{ formatNumber(p) }}
        </button>
      </template>
      <button type="button" class="icon-btn size-9 disabled:pointer-events-none disabled:opacity-40" :disabled="page === pageCount" aria-label="صفحه بعد" @click="go(page + 1)">
        <BaseIcon name="chevron-left" class="size-4" />
      </button>
    </div>
  </nav>
</template>
