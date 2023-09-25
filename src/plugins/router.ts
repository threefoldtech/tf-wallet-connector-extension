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
      component: () => import('../popups/RestoreAccounts.vue')
    },
    {
      path: '/create-account',
      component: () => import('../popups/CreateAccount.vue')
    },
    {
      path: '/create-account/:mnemonic/:keypairType',
      component: () => import('../popups/CreateAccountPassword.vue')
    },
    {
      path: '/create-account/:mnemonic/:keypairType/:name/:password',
      component: () => import('../popups/CreateAccountTwin.vue')
    },
    {
      path: '/create-account-ssh/:mnemonic/:keypairType/:name/:password/:networks',
      component: () => import('../popups/CreateAccountSSH.vue')
    },
    {
      path: '/import-preaccount',
      component: () => import('../views/ImportPreaccount.vue')
    },
    {
      path: '/import-preaccount/:mnemonic/:keypairType/:networks',
      component: () => import('../views/PreaccountDetails.vue')
    },

    {
      path: '/request-access',
      component: () => import('../popups/RequestAccess.vue')
    },
    {
      path: '/manage-access',
      component: () => import('../views/ManageAccess.vue')
    },
    {
      path: '/manage-account/:mnemonic',
      component: () => import('../views/ManageAccount.vue')
    },
    {
      path: '/request-decrypted-account/:mnemonic/:networks',
      component: () => import('../popups/RequestDecryptedAccount.vue')
    },
    {
      path: '/select-decrypted-account/:networks',
      component: () => import('../popups/SelectDecryptedAccount.vue')
    }
  ]
})
