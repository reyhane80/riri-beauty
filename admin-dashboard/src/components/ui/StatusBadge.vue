<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  tone: { type: String, default: 'slate' },
})

// کلاس‌ها کامل نوشته شده‌اند تا Tailwind بتواند آن‌ها را تشخیص دهد
const tones = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20',
  slate: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20',
}

const dots = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-400',
}

const classes = computed(() => tones[props.tone] ?? tones.slate)
</script>

<template>
  <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset', classes]">
    <span :class="['size-1.5 rounded-full', dots[tone] ?? dots.slate]" />
    {{ label }}
  </span>
</template>
