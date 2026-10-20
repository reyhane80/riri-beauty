import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchUsers } from '@/services/api'
import { readStorage, writeStorage } from '@/utils/storage'

const STORAGE_KEY = 'dashboard:users'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const total = computed(() => users.value.length)
  const activeCount = computed(() => users.value.filter((u) => u.status === 'active').length)

  const persist = () => writeStorage(STORAGE_KEY, users.value)

  /** بار اول از JSON خوانده می‌شود؛ تغییرات بعدی در localStorage نگه داشته می‌شوند */
  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      users.value = readStorage(STORAGE_KEY) ?? (await fetchUsers())
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const getById = (id) => users.value.find((u) => u.id === Number(id))

  const isEmailTaken = (email, exceptId) =>
    users.value.some((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== exceptId)

  function create(data) {
    const id = Math.max(0, ...users.value.map((u) => u.id)) + 1
    const user = { ...data, id, createdAt: new Date().toISOString().slice(0, 10) }
    users.value.unshift(user)
    persist()
    return user
  }

  function update(id, data) {
    const index = users.value.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('کاربر یافت نشد')
    users.value[index] = { ...users.value[index], ...data, id }
    persist()
    return users.value[index]
  }

  function remove(id) {
    users.value = users.value.filter((u) => u.id !== id)
    persist()
  }

  /** بازگرداندن داده‌ها به حالت اولیه فایل JSON */
  async function reset() {
    writeStorage(STORAGE_KEY, null)
    loaded.value = false
    users.value = []
    await load()
  }

  return { users, loading, loaded, total, activeCount, load, getById, isEmailTaken, create, update, remove, reset }
})
