import { defineStore } from 'pinia'
import md5 from 'md5'
import Cryptr from 'cryptr'

import { network, loadGrid, sendMessageToContent } from '@/utils'
import type { Account } from '@/types'

export interface WalletStore {
  accounts: Account[]
}

export const useWalletStore = defineStore('wallet:store', {
  state(): WalletStore {
    return {
      accounts: import.meta.env.DEV
        ? [
            {
              name: 'test',
              address: 'test',
              mnemonic: 'test',
              relay: 'test',
              ssh: 's',
              twinId: 0,
              visible: true
            }
          ]
        : []
    }
  },

  actions: {
    findIndex(mnemonic: string) {
      return this.accounts.findIndex((account) => account.mnemonic === mnemonic)
    },

    findAccount(mnemonic: string) {
      return this.accounts[this.findIndex(mnemonic)]
    },

    async toggleVisibility(mnemonic: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].visible = !this.accounts[index].visible
      await sendMessageToContent('UPDATE_ACCOUNT', this.$state.accounts[index])
    },

    async forgetAccount(mnemonic: string) {
      const index = this.findIndex(mnemonic)
      const [account] = this.$state.accounts.splice(index, 1)
      await sendMessageToContent('DELETE_ACCOUNT', account)
    },

    async renameAccount(mnemonic: string, name: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].name = name
      await sendMessageToContent('UPDATE_ACCOUNT', this.$state.accounts[index])
    },

    async restoreAccounts(accounts: Account[]) {
      const accountSet = new Set(this.accounts.map((account) => account.mnemonic))
      const newAccounts = accounts.filter((account) => !accountSet.has(account.mnemonic))
      await sendMessageToContent('ADD_ACCOUNTS', newAccounts)
      this.$state.accounts.push(...newAccounts)
    },

    async addAccount(name: string, mnemonic: string, password: string) {
      const grid = await loadGrid(mnemonic)
      const cryptr = new Cryptr(md5(password), { saltLength: 10, pbkdf2Iterations: 10 })
      const account: Account = {
        name,
        visible: true,
        mnemonic: cryptr.encrypt(mnemonic),
        ssh: '',
        twinId: grid.twinId,
        address: grid.tfclient.address,
        relay: grid.getDefaultUrls(network).relay.slice(6)
      }
      await sendMessageToContent('ADD_ACCOUNT', account)
      this.$state.accounts.push(account)
    },

    async updateSSH(ssh: string, mnemonic: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].ssh = ssh
      await sendMessageToContent('UPDATE_ACCOUNT', this.$state.accounts[index])
    },

    async init(tabId?: number) {
      if (import.meta.env.DEV) return
      this.$state.accounts = await sendMessageToContent('GET_ACCOUNTS', null, tabId)
    }
  }
})
