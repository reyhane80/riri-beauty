<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { fetchDashboard } from '@/services/api'
import { formatCompact, formatNumber, formatPercent } from '@/utils/format'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import RevenueChart from '@/components/dashboard/RevenueChart.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'

const auth = useAuthStore()
const usersStore = useUsersStore()

const data = ref(null)
const error = ref('')

async function load() {
  error.value = ''
  try {
    const [dashboard] = await Promise.all([fetchDashboard(), usersStore.load()])
    data.value = dashboard
  } catch {
    error.value = 'بارگذاری اطلاعات داشبورد با خطا مواجه شد'
  }
}

onMounted(load)

const cards = computed(() => {
  if (!data.value) return []
  const { stats } = data.value
  return [
    { title: 'تعداد کاربران', value: formatNumber(usersStore.total), icon: 'users', change: stats.users.change, tone: 'brand' },
    { title: 'درآمد سالانه (تومان)', value: formatCompact(stats.revenue.total), icon: 'banknotes', change: stats.revenue.change, tone: 'emerald' },
    { title: 'سفارشات', value: formatNumber(stats.orders.total), icon: 'bag', change: stats.orders.change, tone: 'amber' },
    { title: 'نرخ تبدیل', value: formatPercent(stats.conversion.total), icon: 'percent', change: stats.conversion.change, tone: 'sky' },
  ]
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 12 ? 'صبح بخیر' : hour < 18 ? 'روز بخیر' : 'عصر بخیر'
})
</script>

<template>
  <div>
    <PageHeader :title="`${greeting}، ${auth.user?.name ?? ''}`" subtitle="خلاصه وضعیت فروشگاه در یک نگاه" />

    <div v-if="error" class="card flex flex-col items-center gap-4 p-10 text-center">
      <p class="text-slate-600 dark:text-slate-300">{{ error }}</p>
      <button type="button" class="btn-primary" @click="load">تلاش دوباره</button>
    </div>

    <!-- اسکلت بارگذاری -->
    <div v-else-if="!data" class="space-y-6" aria-busy="true" aria-label="در حال بارگذاری">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="card h-36 animate-pulse bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div class="card h-80 animate-pulse bg-slate-100 dark:bg-slate-800/60" />
      <div class="card h-72 animate-pulse bg-slate-100 dark:bg-slate-800/60" />
    </div>

    <div v-else class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard v-for="card in cards" :key="card.title" v-bind="card" />
      </div>

      <RevenueChart :data="data.revenue" />

      <RecentTransactions :transactions="data.transactions.slice(0, 8)" />
    </div>
  </div>
</template>
