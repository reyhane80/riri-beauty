<script setup>
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import BaseIcon from './BaseIcon.vue'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
</script>

<template>
  <button
    type="button"
    class="icon-btn"
    :aria-label="theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'"
    :title="theme === 'dark' ? 'تم روشن' : 'تم تاریک'"
    @click="themeStore.toggle()"
  >
    <BaseIcon :name="theme === 'dark' ? 'sun' : 'moon'" />
  </button>
</template>
