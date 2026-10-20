<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { ROLES, USER_STATUSES } from '@/utils/constants'

// v-model روی یک شیء فیلتر: { q, role, status, sort }
const filters = defineModel({ type: Object, required: true })

const SORTS = {
  newest: 'جدیدترین',
  oldest: 'قدیمی‌ترین',
  name: 'نام (الفبایی)',
}

const hasActive = computed(() => Boolean(filters.value.q || filters.value.role || filters.value.status))

const set = (key, value) => (filters.value = { ...filters.value, [key]: value })
const reset = () => (filters.value = { ...filters.value, q: '', role: '', status: '' })
</script>

<template>
  <div class="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,11rem)_auto]">
    <label class="relative col-span-2 lg:col-span-1">
      <span class="sr-only">جستجو</span>
      <BaseIcon name="search" class="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
      <input
        :value="filters.q"
        type="search"
        class="input ps-10"
        placeholder="جستجو در نام، ایمیل، موبایل یا شهر…"
        @input="set('q', $event.target.value)"
      />
    </label>

    <label>
      <span class="sr-only">نقش</span>
      <select :value="filters.role" class="input" @change="set('role', $event.target.value)">
        <option value="">همه نقش‌ها</option>
        <option v-for="(r, key) in ROLES" :key="key" :value="key">{{ r.label }}</option>
      </select>
    </label>

    <label>
      <span class="sr-only">وضعیت</span>
      <select :value="filters.status" class="input" @change="set('status', $event.target.value)">
        <option value="">همه وضعیت‌ها</option>
        <option v-for="(s, key) in USER_STATUSES" :key="key" :value="key">{{ s.label }}</option>
      </select>
    </label>

    <label>
      <span class="sr-only">مرتب‌سازی</span>
      <select :value="filters.sort" class="input" @change="set('sort', $event.target.value)">
        <option v-for="(label, key) in SORTS" :key="key" :value="key">{{ label }}</option>
      </select>
    </label>

    <button type="button" class="btn-secondary" :disabled="!hasActive" @click="reset">
      <BaseIcon name="refresh" class="size-4" />
      حذف فیلترها
    </button>
  </div>
</template>
