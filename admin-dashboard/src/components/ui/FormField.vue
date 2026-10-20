<script setup>
// پوسته عمومی فیلد فرم: برچسب، راهنما و پیام خطا
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
})
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
      <span v-if="required" class="text-rose-500" aria-hidden="true">*</span>
    </label>
    <slot :invalid="Boolean(error)" :describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined" />
    <p v-if="error" :id="`${id}-error`" class="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>
