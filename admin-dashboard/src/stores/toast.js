import { defineStore } from 'pinia'
import { ref } from 'vue'

let nextId = 1

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function show(message, type = 'success', duration = 3500) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  return {
    toasts,
    dismiss,
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error'),
  }
})
