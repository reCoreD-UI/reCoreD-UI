import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/domains'
    },
    {
      path: '/domains',
      name: 'domains',
      meta: {
        type: 'domains'
      },
      component: () => import('@/views/DomainsView')
    },
    {
      path: '/records/:domain',
      name: 'records',
      meta: {
        type: 'records'
      },
      component: () => import('@/views/RecordsView'),
      props: true
    }
  ]
})

export default router
