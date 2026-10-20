<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'

defineProps({
  sidebarOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const title = computed(() => route.meta.title ?? '')

function logout() {
  auth.logout()
  toast.success('با موفقیت از حساب خارج شدید')
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
    <button
      type="button"
      class="icon-btn lg:hidden"
      aria-label="باز کردن منو"
      aria-controls="app-sidebar"
      :aria-expanded="sidebarOpen"
      @click="emit('toggle-sidebar')"
    >
      <BaseIcon name="menu" />
    </button>

    <p class="truncate font-semibold text-slate-800 dark:text-slate-100">{{ title }}</p>

    <div class="ms-auto flex items-center gap-1 sm:gap-2">
      <ThemeToggle />

      <div class="mx-1 h-8 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

      <div v-if="auth.user" class="flex items-center gap-3">
        <UserAvatar :name="auth.user.name" size="sm" />
        <div class="hidden leading-tight sm:block">
          <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ auth.user.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ auth.user.role }}</p>
        </div>
      </div>

      <button type="button" class="icon-btn text-rose-600 hover:bg-rose-50 hover:text-rose-700 sm:w-auto sm:gap-2 sm:px-3 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300" aria-label="خروج" @click="logout">
        <!-- آیکون خروج برای راست‌به‌چپ قرینه می‌شود -->
        <BaseIcon name="logout" class="size-5 -scale-x-100" />
        <span class="hidden text-sm font-medium sm:inline">خروج</span>
      </button>
    </div>
  </header>
</template>
