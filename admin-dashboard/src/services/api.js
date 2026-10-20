// لایه داده: خواندن از فایل‌های JSON محلی با شبیه‌سازی تأخیر شبکه.
// برای اتصال به بک‌اند واقعی کافی است این توابع با fetch/axios جایگزین شوند.
import users from '@/data/users.json'
import transactions from '@/data/transactions.json'
import revenue from '@/data/revenue.json'
import stats from '@/data/stats.json'
import admins from '@/data/admins.json'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const clone = (data) => structuredClone(data)

export async function fetchUsers() {
  await delay()
  return clone(users)
}

export async function fetchDashboard() {
  await delay(450)
  return {
    stats: clone(stats),
    revenue: clone(revenue),
    transactions: clone(transactions),
  }
}

export async function authenticate(email, password) {
  await delay(600)
  const admin = admins.find((a) => a.email === email.trim().toLowerCase() && a.password === password)
  if (!admin) throw new Error('ایمیل یا رمز عبور اشتباه است')
  const { password: _password, ...user } = admin
  return { user, token: `demo-token-${admin.id}-${Date.now()}` }
}
