import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/hello' },
  { path: '/hello', component: () => import('../components/HelloWorld.vue') },
  { path: '/button', component: () => import('../components/button.vue') },
  { path: '/popper', component: () => import('../components/popper.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
