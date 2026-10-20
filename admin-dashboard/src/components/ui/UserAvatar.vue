<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'md' },
})

const palette = [
  'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
]

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('‌'),
)

// رنگ ثابت برای هر نام
const color = computed(() => {
  const hash = [...props.name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return palette[hash % palette.length]
})

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' }
</script>

<template>
  <span :class="['inline-flex shrink-0 items-center justify-center rounded-full font-semibold', sizes[size], color]" aria-hidden="true">
    {{ initials }}
  </span>
</template>
