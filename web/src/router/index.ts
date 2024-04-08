import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/domains',
      name: 'domains',
      component: () => import('../views/DomainsView.vue')
    },
    {
      path: '/records/:domain',
      name: 'records',
      component: () => import('../views/RecordsView.vue'),
      props: true
    }
  ]
})

export default router
