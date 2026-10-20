<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useToastStore } from '@/stores/toast'
import { fullName } from '@/utils/format'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import UserForm from '@/components/users/UserForm.vue'

const props = defineProps({
  id: { type: String, default: null }, // فقط در مسیر ویرایش
})

const router = useRouter()
const usersStore = useUsersStore()
const toast = useToastStore()

onMounted(() => usersStore.load())

const isEdit = computed(() => props.id !== null)
const user = computed(() => (isEdit.value ? usersStore.getById(props.id) : null))
const notFound = computed(() => isEdit.value && usersStore.loaded && !user.value)

const goBack = () => router.push({ name: 'users' })

async function save(data) {
  // شبیه‌سازی تأخیر درخواست به سرور
  await new Promise((resolve) => setTimeout(resolve, 400))
  if (isEdit.value) {
    usersStore.update(user.value.id, data)
    toast.success('تغییرات کاربر ذخیره شد')
  } else {
    const created = usersStore.create(data)
    toast.success(`کاربر «${fullName(created)}» اضافه شد`)
  }
  goBack()
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <RouterLink :to="{ name: 'users' }" class="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
      <BaseIcon name="arrow-right" class="size-4" />
      بازگشت به لیست کاربران
    </RouterLink>

    <PageHeader
      :title="isEdit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'"
      :subtitle="isEdit && user ? `ویرایش اطلاعات ${fullName(user)}` : 'اطلاعات کاربر جدید را وارد کنید'"
    />

    <div v-if="notFound" class="card flex flex-col items-center gap-4 p-10 text-center">
      <p class="text-slate-600 dark:text-slate-300">کاربر مورد نظر پیدا نشد.</p>
      <RouterLink :to="{ name: 'users' }" class="btn-primary">بازگشت به لیست</RouterLink>
    </div>

    <div v-else-if="!usersStore.loaded" class="card h-96 animate-pulse bg-slate-100 dark:bg-slate-800/60" aria-busy="true" />

    <!-- key باعث می‌شود فرم با مقادیر کاربر مقداردهی شود -->
    <UserForm v-else :key="user?.id ?? 'new'" :user="user" :save="save" @cancel="goBack" />
  </div>
</template>
