<script setup>
import FormField from '@/components/ui/FormField.vue'
import { useForm } from '@/composables/useForm'
import { useUsersStore } from '@/stores/users'
import { CITIES, ROLES, USER_STATUSES } from '@/utils/constants'
import { toEnglishDigits } from '@/utils/format'
import { email, iranMobile, maxLength, minLength, oneOf, persianText, required } from '@/utils/validators'

const props = defineProps({
  user: { type: Object, default: null }, // در حالت ویرایش
  save: { type: Function, required: true }, // تابع async ذخیره؛ تا پایان آن دکمه غیرفعال است
})

const emit = defineEmits(['cancel'])
const usersStore = useUsersStore()

const uniqueEmail = (value) => !value || !usersStore.isEmailTaken(value, props.user?.id) || 'این ایمیل قبلاً ثبت شده است'

const { values, errors, submitting, touch, onInput, handleSubmit } = useForm(
  {
    firstName: props.user?.firstName ?? '',
    lastName: props.user?.lastName ?? '',
    email: props.user?.email ?? '',
    phone: props.user?.phone ?? '',
    city: props.user?.city ?? '',
    role: props.user?.role ?? 'customer',
    status: props.user?.status ?? 'active',
  },
  {
    firstName: [required('نام را وارد کنید'), persianText(), minLength(2), maxLength(30)],
    lastName: [required('نام خانوادگی را وارد کنید'), persianText(), minLength(2), maxLength(40)],
    email: [required('ایمیل را وارد کنید'), email(), uniqueEmail],
    phone: [required('شماره موبایل را وارد کنید'), iranMobile()],
    city: [required('شهر را انتخاب کنید')],
    role: [oneOf(Object.keys(ROLES))],
    status: [oneOf(Object.keys(USER_STATUSES))],
  },
)

const submit = handleSubmit(async (data) => {
  await props.save({
    ...data,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: toEnglishDigits(data.phone).trim(),
  })
})

// ویژگی‌های مشترک برای هر input
const bind = (field) => ({
  id: field,
  class: ['input', { 'input-error': errors[field] }],
  'aria-invalid': Boolean(errors[field]) || undefined,
  'aria-describedby': errors[field] ? `${field}-error` : undefined,
  onBlur: () => touch(field),
  onInput: () => onInput(field),
  onChange: () => touch(field),
})
</script>

<template>
  <form class="card" novalidate @submit.prevent="submit">
    <div class="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
      <h2 class="font-semibold text-slate-900 sm:col-span-2 dark:text-white">اطلاعات فردی</h2>

      <FormField id="firstName" label="نام" required :error="errors.firstName">
        <input v-model="values.firstName" v-bind="bind('firstName')" type="text" autocomplete="given-name" placeholder="مثلاً مریم" />
      </FormField>

      <FormField id="lastName" label="نام خانوادگی" required :error="errors.lastName">
        <input v-model="values.lastName" v-bind="bind('lastName')" type="text" autocomplete="family-name" placeholder="مثلاً احمدی" />
      </FormField>

      <FormField id="email" label="ایمیل" required :error="errors.email">
        <input v-model="values.email" v-bind="bind('email')" type="email" dir="ltr" class="text-start" autocomplete="email" placeholder="name@example.com" />
      </FormField>

      <FormField id="phone" label="شماره موبایل" required :error="errors.phone" hint="ارقام فارسی یا انگلیسی پذیرفته می‌شود">
        <input v-model="values.phone" v-bind="bind('phone')" type="tel" inputmode="numeric" dir="ltr" maxlength="11" autocomplete="tel" placeholder="09123456789" />
      </FormField>

      <FormField id="city" label="شهر" required :error="errors.city">
        <select v-model="values.city" v-bind="bind('city')">
          <option value="" disabled>انتخاب کنید</option>
          <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </FormField>

      <FormField id="role" label="نقش" :error="errors.role">
        <select v-model="values.role" v-bind="bind('role')">
          <option v-for="(r, key) in ROLES" :key="key" :value="key">{{ r.label }}</option>
        </select>
      </FormField>

      <fieldset class="sm:col-span-2">
        <legend class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">وضعیت حساب</legend>
        <div class="flex flex-wrap gap-3">
          <label
            v-for="(s, key) in USER_STATUSES"
            :key="key"
            :class="[
              'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition',
              values.status === key
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
            ]"
          >
            <input v-model="values.status" type="radio" name="status" :value="key" class="accent-brand-600" />
            {{ s.label }}
          </label>
        </div>
      </fieldset>
    </div>

    <div class="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-800">
      <button type="button" class="btn-secondary" @click="emit('cancel')">انصراف</button>
      <button type="submit" class="btn-primary min-w-32" :disabled="submitting">
        <span v-if="submitting" class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
        {{ user ? 'ذخیره تغییرات' : 'افزودن کاربر' }}
      </button>
    </div>
  </form>
</template>
