import { defineStore } from 'pinia'
import md5 from 'md5'
import Cryptr from 'cryptr'

import { getBestNetwork, loadGrid, storage } from '@/utils'
import type { Account, Network } from '@/types'

export interface WalletStore {
  accounts: Account[]
}

export interface AddAccount {
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
                'aba3fa69120798f1a402d212cc2fe4f473fda3b90b24c4973a6e89870203b130ed36517d38701af9dedf128d1389fd6d7815103b83f40fc4c0e146ab4e01858d196f4562fe61896d68c6c511f09d6f0b2ee9f8710adfcd8cef82bbc605ea96a871e625e9aaba112ebf1bf0f99c3660c40f84654df8474ca4b3dd4428e17c',
              address: '5EPdJRyju5DS1xhBWzo6JzLek8MnbcwUEQVLaPZRDLuMMhUv',
              networks: ['qa', 'dev']
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
      const grid = await loadGrid(options.mnemonic, getBestNetwork(options.networks))
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

    updateNetworks(address: string, networks: string[]) {
      const index = this.accounts.findIndex((acc) => acc.address === address)
      const newNetworks = Array.from(new Set([...this.accounts[index].networks, ...networks]))
      this.$state.accounts[index].networks = newNetworks as Network[]
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
