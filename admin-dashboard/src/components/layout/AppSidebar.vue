<script setup>
import { useRoute } from 'vue-router'
import BaseIcon from '@/components/ui/BaseIcon.vue'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
const route = useRoute()

const menu = [
  { label: 'داشبورد', icon: 'home', to: { name: 'dashboard' }, match: ['dashboard'] },
  { label: 'کاربران', icon: 'users', to: { name: 'users' }, match: ['users', 'user-edit'] },
  { label: 'افزودن کاربر', icon: 'user-plus', to: { name: 'user-create' }, match: ['user-create'] },
]

const isActive = (item) => item.match.includes(route.name)
</script>

<template>
  <!-- پس‌زمینه تیره در موبایل -->
  <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200">
    <div v-if="open" class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" aria-hidden="true" @click="emit('close')" />
  </Transition>

  <aside
    id="app-sidebar"
    :class="[
      'fixed inset-y-0 start-0 z-40 flex w-72 flex-col border-e border-slate-200 bg-white transition-transform duration-300 lg:w-64 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900',
      open ? 'translate-x-0' : 'translate-x-full',
    ]"
    aria-label="منوی اصلی"
  >
    <div class="flex h-16 items-center justify-between gap-3 px-5">
      <RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-2.5">
        <span class="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <BaseIcon name="sparkles" />
        </span>
        <span>
          <span class="block font-bold text-slate-900 dark:text-white">ریری بیوتی</span>
          <span class="block text-xs text-slate-500 dark:text-slate-400">پنل مدیریت</span>
        </span>
      </RouterLink>
      <button type="button" class="icon-btn lg:hidden" aria-label="بستن منو" @click="emit('close')">
        <BaseIcon name="x" />
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <p class="mb-2 px-3 text-xs font-medium text-slate-400 dark:text-slate-500">منو</p>
      <ul class="space-y-1">
        <li v-for="item in menu" :key="item.label">
          <RouterLink
            :to="item.to"
            :aria-current="isActive(item) ? 'page' : undefined"
            :class="[
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive(item)
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
            ]"
            @click="emit('close')"
          >
            <BaseIcon :name="item.icon" />
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="m-3 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
      داده‌ها از فایل‌های JSON محلی خوانده می‌شوند و تغییرات در مرورگر ذخیره می‌شود.
    </div>
  </aside>
</template>
