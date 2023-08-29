import { defineStore } from 'pinia'

import { network, loadGrid, readSSH } from '@/utils'

export interface WalletStore {
  account: Account | null
}

export interface Account {
  mnemonic: string
  twinId: number
  address: string
  ssh: string
  relay: string
}

export const useWalletStore = defineStore('wallet:store', {
  state(): WalletStore {
    return {
      account: null
    }
  },

  actions: {
    async login(mnemonic: string) {
      const grid = await loadGrid(mnemonic)
      this.$state.account = {
        mnemonic,
        ssh: await readSSH(grid),
        twinId: grid.twinId,
        address: grid.tfclient.address,
        relay: grid.getDefaultUrls(network).relay.slice(6)
      }
      await grid.disconnect()
    },

    logout() {
      this.$state.account = null
    }
  }
})
