<script setup>
import { useAttrs } from 'vue'
import { icons } from './icons'

defineProps({
  name: { type: String, required: true },
})

// اگر اندازه‌ای از بیرون داده نشده باشد، اندازه پیش‌فرض ۲۰ پیکسل است
const attrs = useAttrs()
const hasSize = () => /\bsize-/.test(attrs.class ?? '')
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    :class="['shrink-0', { 'size-5': !hasSize() }]"
  >
    <path :d="icons[name]" />
  </svg>
</template>
