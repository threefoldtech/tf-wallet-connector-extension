import { defineStore } from 'pinia'
import md5 from 'md5'
import Cryptr from 'cryptr'

import { loadGrid, storage } from '@/utils'
import type { Account } from '@/types'

export interface WalletStore {
  accounts: Account[]
}

interface AddAccount {
  name: string
  mnemonic: string
  networks: string[]
  password: string
}

export const useWalletStore = defineStore('wallet:store', {
  state(): WalletStore {
    return {
      accounts: import.meta.env.DEV
        ? [
            {
              name: 'Rabie',
              visible: true,
              mnemonic:
                'rebuild eager divide effort three frown plate picnic hungry drink size van',
              ssh: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJheWbxEEvk8vPUcLU1sbKa1Kny8aqaN+7uQ/hxXI4ZM engm5081@gmail.com',
              address: '5EPdJRyju5DS1xhBWzo6JzLek8MnbcwUEQVLaPZRDLuMMhUv',
              networks: ['qa', 'dev', 'test', 'main']
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

    async addAccount(options: AddAccount) {
      const grid = await loadGrid(options.mnemonic)
      const cryptr = new Cryptr(md5(options.password), { saltLength: 10, pbkdf2Iterations: 10 })
      const account: Account = {
        name: options.name,
        visible: true,
        mnemonic: cryptr.encrypt(options.mnemonic),
        address: grid.tfclient.address,
        networks: options.networks as any
      }
      this.$state.accounts.push(account)
      return storage.setAccounts(this.$state.accounts)
    },

    /** @todo Remove this method */
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
