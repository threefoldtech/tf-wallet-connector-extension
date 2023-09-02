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
    },
    {
      path: '/create-account',
      component: () => import('../views/CreateAccount.vue')
    },
    {
      path: '/create-account/:mnemonic',
      component: () => import('../views/CreateAccountPassword.vue')
    },
    {
      path: '/create-account/:mnemonic/:name/:password',
      component: () => import('../views/CreateAccountTwin.vue')
    },
    {
      path: '/import-preaccount',
      component: () => import('../views/ImportPreaccount.vue')
    },
    {
      path: '/import-preaccount/:mnemonic',
      component: () => import('../views/PreaccountDetails.vue')
    },

    {
      path: '/request-access',
      component: () => import('../popups/RequestAccess.vue')
    },
    {
      path: '/manage-access',
      component: () => import('../views/ManageAccess.vue')
    }
  ]
})
