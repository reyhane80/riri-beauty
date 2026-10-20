<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useForm } from '@/composables/useForm'
import { email, minLength, required } from '@/utils/validators'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import FormField from '@/components/ui/FormField.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const showPassword = ref(false)
const formError = ref('')

const { values, errors, submitting, touch, onInput, handleSubmit } = useForm(
  { email: '', password: '', remember: true },
  {
    email: [required('ایمیل را وارد کنید'), email()],
    password: [required('رمز عبور را وارد کنید'), minLength(6, 'رمز عبور حداقل ۶ کاراکتر است')],
  },
)

const fillDemo = () => {
  values.email = 'admin@example.com'
  values.password = 'admin123'
  formError.value = ''
  touch('email')
  touch('password')
}

const submit = handleSubmit(async (data) => {
  formError.value = ''
  try {
    const user = await auth.login(data)
    toast.success(`${user.name}، خوش آمدید`)
    // فقط مسیرهای داخلی برای بازگشت پذیرفته می‌شوند
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') && !route.query.redirect.startsWith('//') ? route.query.redirect : '/'
    router.replace(redirect)
  } catch (e) {
    formError.value = e.message
  }
})
</script>

<template>
  <div class="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-white px-4 py-10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
    <div class="absolute end-4 top-4">
      <ThemeToggle />
    </div>

    <div class="w-full max-w-md">
      <div class="mb-8 flex flex-col items-center text-center">
        <span class="flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <BaseIcon name="sparkles" class="size-7" />
        </span>
        <h1 class="mt-4 text-2xl font-bold text-slate-900 dark:text-white">ورود به پنل مدیریت</h1>
        <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">برای ادامه وارد حساب کاربری خود شوید</p>
      </div>

      <form class="card space-y-5 p-6 sm:p-8" novalidate @submit.prevent="submit">
        <div v-if="formError" class="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" role="alert">
          <BaseIcon name="exclamation-circle" />
          {{ formError }}
        </div>

        <FormField id="email" label="ایمیل" :error="errors.email">
          <input
            id="email"
            v-model="values.email"
            type="email"
            dir="ltr"
            autocomplete="username"
            placeholder="admin@example.com"
            :class="['input', { 'input-error': errors.email }]"
            :aria-invalid="Boolean(errors.email) || undefined"
            :aria-describedby="errors.email ? 'email-error' : undefined"
            @blur="touch('email')"
            @input="onInput('email')"
          />
        </FormField>

        <FormField id="password" label="رمز عبور" :error="errors.password">
          <div class="relative">
            <input
              id="password"
              v-model="values.password"
              :type="showPassword ? 'text' : 'password'"
              dir="ltr"
              autocomplete="current-password"
              placeholder="••••••"
              :class="['input pl-11', { 'input-error': errors.password }]"
              :aria-invalid="Boolean(errors.password) || undefined"
              :aria-describedby="errors.password ? 'password-error' : undefined"
              @blur="touch('password')"
              @input="onInput('password')"
            />
            <button
              type="button"
              class="absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              :aria-label="showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'"
              @click="showPassword = !showPassword"
            >
              <BaseIcon :name="showPassword ? 'eye-off' : 'eye'" />
            </button>
          </div>
        </FormField>

        <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input v-model="values.remember" type="checkbox" class="size-4 rounded accent-brand-600" />
          مرا به خاطر بسپار
        </label>

        <button type="submit" class="btn-primary w-full py-3" :disabled="submitting">
          <span v-if="submitting" class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          {{ submitting ? 'در حال ورود…' : 'ورود' }}
        </button>
      </form>

      <div class="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        حساب آزمایشی:
        <span dir="ltr" class="font-medium text-slate-700 dark:text-slate-200">admin@example.com / admin123</span>
        <button type="button" class="ms-2 font-medium text-brand-600 hover:underline dark:text-brand-400" @click="fillDemo">پر کردن خودکار</button>
      </div>
    </div>
  </div>
</template>
