import { defineStore } from 'pinia'
import md5 from 'md5'
import Cryptr from 'cryptr'

import { network, loadGrid, sendMessageToContent, storage } from '@/utils'
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
              visible: true,
              networks: ['dev', 'qa', 'main']
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
      return storage.setAccounts(this.$state.accounts)
    },

    async forgetAccount(mnemonic: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts.splice(index, 1)
      return storage.setAccounts(this.$state.accounts)
    },

    async renameAccount(mnemonic: string, name: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].name = name
      return storage.setAccounts(this.$state.accounts)
    },

    async restoreAccounts(accounts: Account[]) {
      const accountSet = new Set(this.accounts.map((account) => account.mnemonic))
      const newAccounts = accounts.filter((account) => !accountSet.has(account.mnemonic))
      this.$state.accounts.push(...newAccounts)
      return storage.setAccounts(this.$state.accounts)
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
        relay: grid.getDefaultUrls(network).relay.slice(6),
        networks: ['dev']
      }
      this.$state.accounts.push(account)
      return storage.setAccounts(this.$state.accounts)
    },

    async updateSSH(ssh: string, mnemonic: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].ssh = ssh
      return storage.setAccounts(this.$state.accounts)
    },

    async init() {
      if (import.meta.env.DEV) return
      this.$state.accounts = await storage.accounts
    }
  }
})
