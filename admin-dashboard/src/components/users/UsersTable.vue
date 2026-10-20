<script setup>
import BaseIcon from '@/components/ui/BaseIcon.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { ROLES, USER_STATUSES } from '@/utils/constants'
import { formatDate, fullName, toPersianDigits } from '@/utils/format'

defineProps({
  users: { type: Array, required: true },
})

const emit = defineEmits(['delete'])
</script>

<template>
  <!-- جدول در تبلت و دسکتاپ -->
  <div class="hidden overflow-x-auto md:block">
    <table class="w-full text-sm">
      <thead class="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
        <tr>
          <th scope="col" class="px-5 py-3 text-start font-medium">کاربر</th>
          <th scope="col" class="px-5 py-3 text-start font-medium">موبایل</th>
          <th scope="col" class="hidden px-5 py-3 text-start font-medium lg:table-cell">شهر</th>
          <th scope="col" class="px-5 py-3 text-start font-medium">نقش</th>
          <th scope="col" class="px-5 py-3 text-start font-medium">وضعیت</th>
          <th scope="col" class="hidden px-5 py-3 text-start font-medium xl:table-cell">تاریخ عضویت</th>
          <th scope="col" class="px-5 py-3 text-end font-medium"><span class="sr-only">عملیات</span></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
        <tr v-for="user in users" :key="user.id" class="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td class="px-5 py-3">
            <div class="flex items-center gap-3">
              <UserAvatar :name="fullName(user)" />
              <div class="min-w-0">
                <p class="truncate font-medium text-slate-800 dark:text-slate-100">{{ fullName(user) }}</p>
                <p class="truncate text-xs text-slate-500 dark:text-slate-400" dir="ltr">{{ user.email }}</p>
              </div>
            </div>
          </td>
          <td class="tabular px-5 py-3 text-slate-600 dark:text-slate-300">{{ toPersianDigits(user.phone) }}</td>
          <td class="hidden px-5 py-3 text-slate-600 lg:table-cell dark:text-slate-300">{{ user.city }}</td>
          <td class="px-5 py-3"><StatusBadge v-bind="ROLES[user.role]" /></td>
          <td class="px-5 py-3"><StatusBadge v-bind="USER_STATUSES[user.status]" /></td>
          <td class="tabular hidden px-5 py-3 whitespace-nowrap text-slate-500 xl:table-cell dark:text-slate-400">{{ formatDate(user.createdAt) }}</td>
          <td class="px-5 py-3">
            <div class="flex justify-end gap-1">
              <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }" class="icon-btn size-9" :aria-label="`ویرایش ${fullName(user)}`" title="ویرایش">
                <BaseIcon name="pencil" class="size-[18px]" />
              </RouterLink>
              <button type="button" class="icon-btn size-9 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400" :aria-label="`حذف ${fullName(user)}`" title="حذف" @click="emit('delete', user)">
                <BaseIcon name="trash" class="size-[18px]" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- کارت‌ها در موبایل -->
  <ul class="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
    <li v-for="user in users" :key="user.id" class="p-4">
      <div class="flex items-start gap-3">
        <UserAvatar :name="fullName(user)" />
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium text-slate-800 dark:text-slate-100">{{ fullName(user) }}</p>
          <p class="truncate text-xs text-slate-500 dark:text-slate-400" dir="ltr">{{ user.email }}</p>
          <p class="tabular mt-1 text-xs text-slate-500 dark:text-slate-400">{{ toPersianDigits(user.phone) }} · {{ user.city }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <StatusBadge v-bind="ROLES[user.role]" />
            <StatusBadge v-bind="USER_STATUSES[user.status]" />
          </div>
        </div>
        <div class="flex gap-1">
          <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }" class="icon-btn size-9" :aria-label="`ویرایش ${fullName(user)}`">
            <BaseIcon name="pencil" class="size-[18px]" />
          </RouterLink>
          <button type="button" class="icon-btn size-9 hover:text-rose-600" :aria-label="`حذف ${fullName(user)}`" @click="emit('delete', user)">
            <BaseIcon name="trash" class="size-[18px]" />
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>
