import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'dashboard:theme'

function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(initialTheme())

  watch(
    theme,
    (value) => {
      document.documentElement.classList.toggle('dark', value === 'dark')
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch {
        // ignore
      }
    },
    { immediate: true },
  )

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
})
