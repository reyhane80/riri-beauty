<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const sidebarOpen = ref(false)
const route = useRoute()

// با تغییر صفحه، منوی موبایل بسته شود
watch(() => route.fullPath, () => (sidebarOpen.value = false))
</script>

<template>
  <div class="min-h-dvh" @keydown.esc="sidebarOpen = false">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="lg:ps-64">
      <AppHeader :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <RouterView v-slot="{ Component, route: viewRoute }">
          <Transition mode="out-in" enter-from-class="opacity-0 translate-y-1" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-100">
            <component :is="Component" :key="viewRoute.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
