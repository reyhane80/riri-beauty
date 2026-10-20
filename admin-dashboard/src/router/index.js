import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'ورود', guestOnly: true },
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'داشبورد' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'کاربران' },
      },
      {
        path: 'users/new',
        name: 'user-create',
        component: () => import('@/views/UserFormView.vue'),
        meta: { title: 'افزودن کاربر', parent: 'users' },
      },
      {
        path: 'users/:id/edit',
        name: 'user-edit',
        component: () => import('@/views/UserFormView.vue'),
        props: true,
        meta: { title: 'ویرایش کاربر', parent: 'users' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'صفحه پیدا نشد' },
  },
]

// روی هاست‌های استاتیک مثل GitHub Pages از حالت hash استفاده می‌شود (فایل .env.pages)
const history =
  import.meta.env.VITE_ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | پنل مدیریت ریری` : 'پنل مدیریت ریری'
})

export default router
