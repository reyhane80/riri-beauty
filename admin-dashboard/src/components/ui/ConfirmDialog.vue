<script setup>
import { nextTick, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'تأیید' },
})

const emit = defineEmits(['confirm', 'cancel'])
const cancelButton = ref(null)

watch(
  () => props.open,
  async (open) => {
    if (open) {
      await nextTick()
      cancelButton.value?.focus()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-150" leave-to-class="opacity-0" leave-active-class="transition duration-150">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center" @click.self="emit('cancel')" @keydown.esc="emit('cancel')">
        <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" class="card w-full max-w-md p-6">
          <div class="flex gap-4">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <BaseIcon name="exclamation-circle" class="size-6" />
            </span>
            <div>
              <h2 id="confirm-title" class="font-semibold text-slate-900 dark:text-white">{{ title }}</h2>
              <p v-if="message" class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ message }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button ref="cancelButton" type="button" class="btn-secondary" @click="emit('cancel')">انصراف</button>
            <button type="button" class="btn-danger" @click="emit('confirm')">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
