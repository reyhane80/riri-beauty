<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useToastStore } from '@/stores/toast'
import { PAGE_SIZES } from '@/utils/constants'
import { formatNumber, fullName } from '@/utils/format'
import { normalize } from '@/utils/search'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import UserFilters from '@/components/users/UserFilters.vue'
import UsersTable from '@/components/users/UsersTable.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const toast = useToastStore()

// وضعیت فیلترها از آدرس صفحه خوانده می‌شود تا با بازگشت از صفحه ویرایش حفظ شود
const filters = ref({
  q: route.query.q ?? '',
  role: route.query.role ?? '',
  status: route.query.status ?? '',
  sort: route.query.sort ?? 'newest',
})
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(PAGE_SIZES.includes(Number(route.query.size)) ? Number(route.query.size) : 10)

onMounted(() => usersStore.load())

const filtered = computed(() => {
  const q = normalize(filters.value.q)
  const { role, status, sort } = filters.value

  const result = usersStore.users.filter((u) => {
    if (role && u.role !== role) return false
    if (status && u.status !== status) return false
    if (!q) return true
    return normalize(`${fullName(u)} ${u.email} ${u.phone} ${u.city}`).includes(q)
  })

  const sorters = {
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id,
    oldest: (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id,
    name: (a, b) => fullName(a).localeCompare(fullName(b), 'fa'),
  }
  return result.sort(sorters[sort] ?? sorters.newest)
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paginated = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

// با تغییر فیلتر به صفحه اول برگرد
watch([() => ({ ...filters.value }), pageSize], () => (page.value = 1))

// اگر با حذف کاربر صفحه فعلی خالی شد
watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

watch([filters, page, pageSize], () => {
  const { q, role, status, sort } = filters.value
  router.replace({
    query: {
      ...(q && { q }),
      ...(role && { role }),
      ...(status && { status }),
      ...(sort !== 'newest' && { sort }),
      ...(page.value > 1 && { page: page.value }),
      ...(pageSize.value !== 10 && { size: pageSize.value }),
    },
  })
})

// حذف کاربر
const pendingDelete = ref(null)

function confirmDelete() {
  const user = pendingDelete.value
  usersStore.remove(user.id)
  pendingDelete.value = null
  toast.success(`کاربر «${fullName(user)}» حذف شد`)
}

async function resetData() {
  await usersStore.reset()
  toast.success('داده‌ها به حالت اولیه بازگردانده شد')
}
</script>

<template>
  <div>
    <PageHeader title="کاربران" :subtitle="`${formatNumber(usersStore.total)} کاربر، ${formatNumber(usersStore.activeCount)} کاربر فعال`">
      <template #actions>
        <button type="button" class="btn-secondary" title="بازگردانی داده‌های JSON اولیه" @click="resetData">
          <BaseIcon name="refresh" class="size-4" />
          <span class="hidden sm:inline">بازنشانی داده‌ها</span>
        </button>
        <RouterLink :to="{ name: 'user-create' }" class="btn-primary">
          <BaseIcon name="plus" class="size-4" />
          افزودن کاربر
        </RouterLink>
      </template>
    </PageHeader>

    <section class="card overflow-hidden">
      <div class="border-b border-slate-200 p-4 sm:p-5 dark:border-slate-800">
        <UserFilters v-model="filters" />
      </div>

      <div v-if="usersStore.loading" class="space-y-3 p-5" aria-busy="true">
        <div v-for="i in 5" :key="i" class="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
      </div>

      <div v-else-if="filtered.length === 0" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span class="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
          <BaseIcon name="inbox" class="size-7" />
        </span>
        <p class="font-medium text-slate-700 dark:text-slate-200">کاربری با این مشخصات پیدا نشد</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">عبارت جستجو یا فیلترها را تغییر دهید.</p>
      </div>

      <UsersTable v-else :users="paginated" @delete="pendingDelete = $event" />

      <div v-if="filtered.length" class="flex flex-col gap-3 border-t border-slate-200 p-4 sm:px-5 lg:flex-row lg:items-center dark:border-slate-800">
        <label class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          تعداد در صفحه
          <select v-model.number="pageSize" class="input w-20 py-1.5">
            <option v-for="size in PAGE_SIZES" :key="size" :value="size">{{ formatNumber(size) }}</option>
          </select>
        </label>
        <AppPagination v-model:page="page" :page-size="pageSize" :total="filtered.length" class="lg:flex-1" />
      </div>
    </section>

    <ConfirmDialog
      :open="Boolean(pendingDelete)"
      title="حذف کاربر"
      :message="pendingDelete ? `آیا از حذف «${fullName(pendingDelete)}» مطمئن هستید؟ این عمل قابل بازگشت نیست.` : ''"
      confirm-text="بله، حذف شود"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
