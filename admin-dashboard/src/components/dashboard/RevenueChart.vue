<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatCompact, formatPrice } from '@/utils/format'

const props = defineProps({
  data: { type: Array, required: true }, // [{ month, amount }]
})

const PERIODS = [
  { value: 6, label: '۶ ماه' },
  { value: 12, label: '۱۲ ماه' },
]
const period = ref(12)

const HEIGHT = 260
const PAD = { top: 16, right: 64, bottom: 32, left: 16 }

const container = ref(null)
const width = ref(600)
const activeIndex = ref(null)

let observer
onMounted(() => {
  observer = new ResizeObserver(([entry]) => (width.value = Math.max(280, entry.contentRect.width)))
  observer.observe(container.value)
})
onBeforeUnmount(() => observer?.disconnect())

const points = computed(() => props.data.slice(-period.value))
const total = computed(() => points.value.reduce((sum, p) => sum + p.amount, 0))

/** گام «گرد» برای خطوط راهنمای محور عمودی */
function niceStep(raw) {
  const pow = 10 ** Math.floor(Math.log10(raw))
  const r = raw / pow
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * pow
}

const yTicks = computed(() => {
  const max = Math.max(...points.value.map((p) => p.amount), 1)
  const step = niceStep(max / 4)
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
})
const yMax = computed(() => yTicks.value.at(-1))

const plotW = computed(() => width.value - PAD.left - PAD.right)
const plotH = HEIGHT - PAD.top - PAD.bottom
const step = computed(() => plotW.value / Math.max(1, points.value.length - 1))

// محور زمان راست‌به‌چپ است: قدیمی‌ترین ماه سمت راست
const x = (i) => width.value - PAD.right - i * step.value
const y = (v) => PAD.top + plotH - (v / yMax.value) * plotH

const linePath = computed(() => points.value.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.amount)}`).join(' '))
const areaPath = computed(() => {
  const last = points.value.length - 1
  return `${linePath.value} L${x(last)},${y(0)} L${x(0)},${y(0)} Z`
})

// در عرض کم، برچسب ماه‌ها یکی در میان نمایش داده می‌شوند
const labelEvery = computed(() => (step.value < 44 ? 2 : 1))

function onPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const px = event.clientX - rect.left
  const index = Math.round((width.value - PAD.right - px) / step.value)
  activeIndex.value = Math.min(points.value.length - 1, Math.max(0, index))
}

function onKeydown(event) {
  const last = points.value.length - 1
  const current = activeIndex.value ?? last
  // در راست‌به‌چپ، فلش چپ به ماه بعدی می‌رود
  if (event.key === 'ArrowLeft') activeIndex.value = Math.min(last, current + 1)
  else if (event.key === 'ArrowRight') activeIndex.value = Math.max(0, current - 1)
  else return
  event.preventDefault()
}

const active = computed(() => (activeIndex.value === null ? null : points.value[activeIndex.value]))
const tooltipStyle = computed(() => {
  if (activeIndex.value === null) return {}
  const left = Math.min(Math.max(x(activeIndex.value), 70), width.value - 70)
  return { left: `${left}px`, top: `${Math.max(y(active.value.amount) - 12, 0)}px` }
})

function setPeriod(value) {
  period.value = value
  activeIndex.value = null
}
</script>

<template>
  <section class="card p-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="font-semibold text-slate-900 dark:text-white">درآمد ماهانه</h2>
        <p class="tabular mt-1 text-sm text-slate-500 dark:text-slate-400">
          مجموع {{ period === 12 ? 'یک سال' : 'شش ماه' }} اخیر:
          <span class="font-semibold text-slate-800 dark:text-slate-200">{{ formatPrice(total) }}</span>
        </p>
      </div>
      <div class="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="بازه زمانی">
        <button
          v-for="p in PERIODS"
          :key="p.value"
          type="button"
          :aria-pressed="period === p.value"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-medium transition',
            period === p.value ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ]"
          @click="setPeriod(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <div ref="container" class="relative mt-4 text-brand-600 dark:text-brand-400">
      <svg
        :width="width"
        :height="HEIGHT"
        :viewBox="`0 0 ${width} ${HEIGHT}`"
        class="block touch-pan-y outline-none focus-visible:rounded-lg focus-visible:ring-4 focus-visible:ring-brand-500/20"
        role="img"
        aria-label="نمودار درآمد ماهانه؛ با کلیدهای جهت‌نما بین ماه‌ها حرکت کنید"
        tabindex="0"
        @pointermove="onPointerMove"
        @pointerleave="activeIndex = null"
        @keydown="onKeydown"
        @blur="activeIndex = null"
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- خطوط راهنما و برچسب‌های محور عمودی -->
        <g class="text-slate-200 dark:text-slate-800">
          <line v-for="tick in yTicks" :key="tick" :x1="PAD.left" :x2="width - PAD.right" :y1="y(tick)" :y2="y(tick)" stroke="currentColor" :stroke-dasharray="tick === 0 ? '' : '3 4'" />
        </g>
        <g class="fill-slate-400 text-[11px] dark:fill-slate-500">
          <text v-for="tick in yTicks" :key="tick" :x="width - 2" :y="y(tick)" dominant-baseline="middle" text-anchor="start" direction="rtl">
            {{ tick === 0 ? '۰' : formatCompact(tick) }}
          </text>
          <template v-for="(p, i) in points" :key="p.month">
            <text v-if="(points.length - 1 - i) % labelEvery === 0" :x="x(i)" :y="HEIGHT - 8" text-anchor="middle" :class="{ 'fill-slate-700 font-medium dark:fill-slate-200': i === activeIndex }">
              {{ p.month }}
            </text>
          </template>
        </g>

        <path :d="areaPath" fill="url(#revenue-fill)" />
        <path :d="linePath" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />

        <g v-if="active">
          <line :x1="x(activeIndex)" :x2="x(activeIndex)" :y1="PAD.top" :y2="y(0)" class="stroke-slate-300 dark:stroke-slate-600" stroke-dasharray="3 3" />
          <circle :cx="x(activeIndex)" :cy="y(active.amount)" r="5" fill="currentColor" class="stroke-white dark:stroke-slate-900" stroke-width="2" />
        </g>
      </svg>

      <div
        v-if="active"
        class="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs whitespace-nowrap shadow-lg dark:border-slate-700 dark:bg-slate-800"
        :style="tooltipStyle"
        role="status"
      >
        <p class="text-slate-500 dark:text-slate-400">{{ active.month }}</p>
        <p class="tabular mt-0.5 font-semibold text-slate-900 dark:text-white">{{ formatPrice(active.amount) }}</p>
      </div>
    </div>

    <!-- نسخه جدولی برای صفحه‌خوان‌ها -->
    <table class="sr-only">
      <caption>درآمد ماهانه به تومان</caption>
      <thead>
        <tr><th scope="col">ماه</th><th scope="col">درآمد</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in points" :key="p.month"><td>{{ p.month }}</td><td>{{ formatPrice(p.amount) }}</td></tr>
      </tbody>
    </table>
  </section>
</template>
