import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authenticate } from '@/services/api'
import { readStorage, writeStorage } from '@/utils/storage'

const STORAGE_KEY = 'dashboard:session'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(readStorage(STORAGE_KEY))

  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => Boolean(session.value?.token))

  async function login({ email, password, remember }) {
    const result = await authenticate(email, password)
    session.value = result
    // بدون «مرا به خاطر بسپار» نشست فقط تا بستن تب باقی می‌ماند
    if (remember) writeStorage(STORAGE_KEY, result)
    return result.user
  }

  function logout() {
    session.value = null
    writeStorage(STORAGE_KEY, null)
  }

  return { user, isAuthenticated, login, logout }
})
