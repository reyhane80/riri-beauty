<script setup>
import StatusBadge from '@/components/ui/StatusBadge.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { TRANSACTION_STATUSES } from '@/utils/constants'
import { formatDate, formatNumber, formatPrice } from '@/utils/format'

defineProps({
  transactions: { type: Array, required: true },
})

const status = (key) => TRANSACTION_STATUSES[key] ?? { label: key, tone: 'slate' }
</script>

<template>
  <section class="card overflow-hidden">
    <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
      <h2 class="font-semibold text-slate-900 dark:text-white">آخرین تراکنش‌ها</h2>
      <span class="text-xs text-slate-500 dark:text-slate-400">{{ formatNumber(transactions.length) }} تراکنش اخیر</span>
    </div>

    <!-- جدول در تبلت و دسکتاپ -->
    <div class="hidden overflow-x-auto md:block">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          <tr>
            <th scope="col" class="px-5 py-3 text-start font-medium">مشتری</th>
            <th scope="col" class="px-5 py-3 text-start font-medium">محصول</th>
            <th scope="col" class="px-5 py-3 text-start font-medium">تاریخ</th>
            <th scope="col" class="px-5 py-3 text-start font-medium">مبلغ</th>
            <th scope="col" class="px-5 py-3 text-start font-medium">وضعیت</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="t in transactions" :key="t.id" class="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <UserAvatar :name="t.customer" size="sm" />
                <div>
                  <p class="font-medium text-slate-800 dark:text-slate-100">{{ t.customer }}</p>
                  <p class="text-xs text-slate-400" dir="ltr">{{ t.id }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 text-slate-600 dark:text-slate-300">{{ t.product }}</td>
            <td class="tabular px-5 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">{{ formatDate(t.date) }}</td>
            <td class="tabular px-5 py-3 font-medium whitespace-nowrap text-slate-800 dark:text-slate-100">{{ formatPrice(t.amount) }}</td>
            <td class="px-5 py-3"><StatusBadge v-bind="status(t.status)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- لیست کارتی در موبایل -->
    <ul class="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      <li v-for="t in transactions" :key="t.id" class="flex items-center gap-3 px-4 py-3">
        <UserAvatar :name="t.customer" size="sm" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{{ t.customer }}</p>
          <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ t.product }} · {{ formatDate(t.date) }}</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <p class="tabular text-sm font-semibold whitespace-nowrap text-slate-800 dark:text-slate-100">{{ formatPrice(t.amount) }}</p>
          <StatusBadge v-bind="status(t.status)" />
        </div>
      </li>
    </ul>
  </section>
</template>
