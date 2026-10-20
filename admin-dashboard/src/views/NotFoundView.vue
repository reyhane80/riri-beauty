<template>
  <div class="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
    <p class="text-6xl font-black text-brand-600 dark:text-brand-400">۴۰۴</p>
    <h1 class="text-xl font-bold text-slate-900 dark:text-white">صفحه مورد نظر پیدا نشد</h1>
    <p class="text-slate-500 dark:text-slate-400">ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد.</p>
    <RouterLink :to="{ name: 'dashboard' }" class="btn-primary mt-2">بازگشت به داشبورد</RouterLink>
  </div>
</template>
