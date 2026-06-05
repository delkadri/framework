import { createRouter, createWebHistory } from 'vue-router'
import { useLibraryStore } from '@/stores/library'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/pages/CatalogPage.vue'),
    },
    {
      path: '/games/:id',
      name: 'game-detail',
      component: () => import('@/pages/GameDetailPage.vue'),
      props: true,
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('@/pages/LibraryPage.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/pages/StatsPage.vue'),
      meta: { requiresLibrary: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (!to.meta.requiresLibrary) return true

  const library = useLibraryStore()
  if (library.hasItems) return true

  return {
    name: 'library',
    query: { blocked: 'stats' },
  }
})
