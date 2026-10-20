<script setup>
import { useToastStore } from '@/stores/toast'
import BaseIcon from './BaseIcon.vue'

const toast = useToastStore()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:items-end" aria-live="polite">
    <TransitionGroup
      enter-from-class="translate-y-2 opacity-0"
      enter-active-class="transition duration-200"
      leave-to-class="opacity-0"
      leave-active-class="transition duration-150"
    >
      <div
        v-for="item in toast.toasts"
        :key="item.id"
        class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800"
      >
        <span :class="item.type === 'error' ? 'text-rose-500' : 'text-emerald-500'">
          <BaseIcon :name="item.type === 'error' ? 'exclamation-circle' : 'check-circle'" />
        </span>
        <p class="flex-1 text-slate-700 dark:text-slate-200">{{ item.message }}</p>
        <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="بستن" @click="toast.dismiss(item.id)">
          <BaseIcon name="x" class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
