<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { formatPercent } from '@/utils/format'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
  change: { type: Number, default: null },
  caption: { type: String, default: 'نسبت به ماه قبل' },
  tone: { type: String, default: 'brand' },
})

const tones = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
}

const isUp = computed(() => props.change >= 0)
</script>

<template>
  <article class="card p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-sm text-slate-500 dark:text-slate-400">{{ title }}</h3>
        <p class="tabular mt-2 truncate text-2xl font-bold text-slate-900 dark:text-white">{{ value }}</p>
      </div>
      <span :class="['flex size-11 shrink-0 items-center justify-center rounded-xl', tones[tone]]">
        <BaseIcon :name="icon" class="size-6" />
      </span>
    </div>
    <p v-if="change !== null" class="mt-4 flex items-center gap-1.5 text-xs">
      <span
        :class="[
          'tabular inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium',
          isUp ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
        ]"
      >
        <BaseIcon :name="isUp ? 'trend-up' : 'trend-down'" class="size-3.5 -scale-x-100" />
        {{ isUp ? '+' : '−' }}{{ formatPercent(change) }}
        <span class="sr-only">{{ isUp ? 'افزایش' : 'کاهش' }}</span>
      </span>
      <span class="text-slate-500 dark:text-slate-400">{{ caption }}</span>
    </p>
  </article>
</template>
