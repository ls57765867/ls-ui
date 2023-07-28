import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/hello' }
  // { path: '/hello2', component: () => import('../components/HelloWorld.vue') }
  // { path: '/button', component: () => import('../components/button.vue') },
  // { path: '/popper', component: () => import('../components/popper.vue') }
]

const modules = import.meta.glob('../components/*.vue')

for (const path in modules) {
  routes.push({
    path: '/' + path.split('/').at(-1)!.replace('.vue', ''),
    component: () => import(/* @vite-ignore */ path)
  })
  // 处理模块
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
