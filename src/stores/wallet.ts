import { defineStore } from 'pinia'

import { network, loadGrid, readSSH, sendMessage } from '@/utils'
import type { Account } from '@/types'

export interface WalletStore {
  accounts: Account[]
}

export const useWalletStore = defineStore('wallet:store', {
  state(): WalletStore {
    return {
      accounts: [
        {
          name: 'Rabie',
          mnemonic: 'rebuild eager divide effort three frown plate picnic hungry drink size van',
          ssh: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDPHqunwzmMIW1rDyKhZ36CATFhfioYX3tpT6a7vQfv07IoIMcescAl4mNtbbx+TyqQby+i7x2noFTWKttM6RLJMaci1tJ0kzhdqJNp9vIQy6D8JT9l9rB1uGkUdJB6GFiXP2X+Mg/lMHRF+/2fh6D0YqqJEPnNqa63qPzWwHyhs/X8bkuNN5XtSEOuuIKu9X2TbLLZb/xwlOmWAD8DHll8GRbudVQdY3eRjqpRuslMuja5Jjx4XHNEDP274mK0mt2I2LgvWgPFREzvbztKdfnCvMD/utRztMp089c2bvTyo9BopxHxgCrXcyYfOcTH+XWUI9yIk9nwciLVvDuxWKFM6HmXQLThu0Yo4w4qTvvj9/sm9SI1EcFsdPT8WNbFEUL648KDZ5HPQghU1yXDIpKw+XhQ3wb907d8ngkVKzKriFywb1qQq436mX7HUQi+7ge37AMgg1xTxucNd+2n/vWJGkVuV+xFP50LiI0bwq3ysvULVQTV9dVeOPzG2L6FsTOURsNwNL3b/wxPcMcKHV2fxEeTtp8q4ROomstGLVxJlUJzs0t5xEv0QFVpLbKGD+flmo7nEnfI+JgXkhtlLPoDW+EFf7iacA8rojoinxfxFKj9KYc2s+B+d1xPe6B6b0ddTxjTcmFF6RTEuddTHPO2YnLw3/gaQhKkmKJstT4sjQ== Threefold',
          twinId: 370,
          address: '5EPdJRyju5DS1xhBWzo6JzLek8MnbcwUEQVLaPZRDLuMMhUv',
          relay: 'relay.dev.grid.tf',
          visible: true
        },
        {
          name: 'Emad',
          mnemonic:
            'actual reveal dish guilt inner film scheme between lonely myself material replace',
          ssh: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCF3JezThwSchTvkF2oPtn8X6chevNsfE58dIY3/eg5zK9tKgNYIB2saoFh12a0AJU424sAeLO0HghhNhe/Co62xkzHhk6EpXWNSFkrlzw+FVn1FKDZbbOZH47sC3n6p5a3YhM4dALssZ/aZdpaKBgXkzk91usJ+GVa+eOnpMRBlHgi9PpvowyzPSKeH9ZcVRBPnVU+nQGyV+kd6RahNBoNgNrHu/QFI92yg/y/7Szus1IS0U92cWKf/K/Sot7O10kSjmj06lMGOO8zdENk/xrtUtRHzemCj+mq0Q/3KUMCGvdb/tH0TDeNenxvibummiym4VTcnYqbm+RDXWG8HUc/RPfEVBl8p1NGZnkBt6QJl5hddHaYwx8CCmf3maSrQFcmrWYtlUDBXYkPyrv0qmy2gM1PScntF/X9zhIfnELlyAVAKXfzVwixrBh7oOIAqefydSVcwWtCXoH38F5q/zo9bQv+eHntI83mZrUUT7JGirQF64fpJKbCZPhv0kUm9bF7DVQMiyRZdk748cgVp7dEzMVlrfZ2eIvZag5zmuJTPB7bw00+Ik9jNaOIhEoCWEaYBw7KmrLonesV8rWUkEAwWPe28bXCVmUZlgZbWJi7BFWCst2Z/j2WgScHbdAv28gAcneDW4yQmt2YaYqXqmwgSVCaD/irq5FSO4upmo5u0Q== mahmmoud.hassanein@gmail.com',
          twinId: 143,
          address: '5EhMjEwYYvBsGiZKUY8Nc5j9JWN3sb21aQbDMEtBVpFQ9pD3',
          relay: 'relay.dev.grid.tf',
          visible: false
        },
        {
          name: 'Thabet',
          mnemonic:
            'actual reveal dish guilt inner film scheme between lonely myself material replace2',
          ssh: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCF3JezThwSchTvkF2oPtn8X6chevNsfE58dIY3/eg5zK9tKgNYIB2saoFh12a0AJU424sAeLO0HghhNhe/Co62xkzHhk6EpXWNSFkrlzw+FVn1FKDZbbOZH47sC3n6p5a3YhM4dALssZ/aZdpaKBgXkzk91usJ+GVa+eOnpMRBlHgi9PpvowyzPSKeH9ZcVRBPnVU+nQGyV+kd6RahNBoNgNrHu/QFI92yg/y/7Szus1IS0U92cWKf/K/Sot7O10kSjmj06lMGOO8zdENk/xrtUtRHzemCj+mq0Q/3KUMCGvdb/tH0TDeNenxvibummiym4VTcnYqbm+RDXWG8HUc/RPfEVBl8p1NGZnkBt6QJl5hddHaYwx8CCmf3maSrQFcmrWYtlUDBXYkPyrv0qmy2gM1PScntF/X9zhIfnELlyAVAKXfzVwixrBh7oOIAqefydSVcwWtCXoH38F5q/zo9bQv+eHntI83mZrUUT7JGirQF64fpJKbCZPhv0kUm9bF7DVQMiyRZdk748cgVp7dEzMVlrfZ2eIvZag5zmuJTPB7bw00+Ik9jNaOIhEoCWEaYBw7KmrLonesV8rWUkEAwWPe28bXCVmUZlgZbWJi7BFWCst2Z/j2WgScHbdAv28gAcneDW4yQmt2YaYqXqmwgSVCaD/irq5FSO4upmo5u0Q== mahmmoud.hassanein@gmail.com',
          twinId: 143,
          address: '5EhMjEwYYvBsGiZKUY8Nc5j9JWN3sb21aQbDMEtBVpFQ9pD3',
          relay: 'relay.dev.grid.tf',
          visible: false
        }
      ]
    }
  },

  actions: {
    findIndex(mnemonic: string) {
      return this.accounts.findIndex((account) => account.mnemonic === mnemonic)
    },

    findAccount(mnemonic: string) {
      return this.accounts[this.findIndex(mnemonic)]
    },

    toggleVisibility(mnemonic: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].visible = !this.accounts[index].visible
    },

    forgetAccount(mnemonic: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts.splice(index, 1)
    },

    renameAccount(mnemonic: string, name: string) {
      const index = this.findIndex(mnemonic)
      this.$state.accounts[index].name = name
    },

    restoreAccounts(accounts: Account[]) {
      const accountSet = new Set(this.accounts.map((account) => account.mnemonic))
      const newAccounts = accounts.filter((account) => !accountSet.has(account.mnemonic))
      this.$state.accounts.push(...newAccounts)
    },

    async login(mnemonic: string) {
      // const grid = await loadGrid(mnemonic)
      // this.$state.account = {
      //   name: 'test',
      //   visible: true,
      //   mnemonic,
      //   ssh: await readSSH(grid),
      //   twinId: grid.twinId,
      //   address: grid.tfclient.address,
      //   relay: grid.getDefaultUrls(network).relay.slice(6)
      // }
      // await sendMessage('Login', this.account)
    },

    async updateSSH(ssh: string) {
      // this.$state.account!.ssh = ssh
      // await sendMessage('Login', this.account)
    },

    async logout() {
      // this.$state.account = null
      // await sendMessage('Logout', this.account)
    },

    async init() {
      // const account = await sendMessage<Account | null>('GetSessionStorage')
      // if (account) {
      //   this.$state.account = account
      // }
    }
  }
})
