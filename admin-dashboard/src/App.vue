<script setup>
import { useThemeStore } from '@/stores/theme'
import ToastContainer from '@/components/ui/ToastContainer.vue'

// مقداردهی اولیه تم (کلاس dark روی <html>)
useThemeStore()
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
