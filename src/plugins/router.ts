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
    },
    {
      path: '/export-account/:mnemonic',
      component: () => import('../views/ExportAccount.vue')
    },
    {
      path: '/export-accounts',
      component: () => import('../views/ExportAccounts.vue')
    },
    {
      path: '/restore-accounts',
      component: () => import('../views/RestoreAccounts.vue')
    }
  ]
})
