import { createRouter, createWebHashHistory } from 'vue-router'

export const $router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/AccountsList.vue')
    },
    {
      path: '/forget-account/:mnemonic',
      component: () => import('../views/ForgetAccount.vue')
    }
  ]
})
