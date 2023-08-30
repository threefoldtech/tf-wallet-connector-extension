<template>
  <main :style="{ width: '485px' }">
    <v-card class="rounded-0">
      <v-card-title>Connect your TFChain Wallet</v-card-title>
      <v-card-subtitle>
        Please visit
        <a
          href="https://manual.grid.tf/playground/wallet_connector.html"
          target="_blank"
          class="text-blue-lighten-1 text-decoration-none font-weight-bold"
        >
          the manual</a
        >
        get started.
      </v-card-subtitle>
      <v-divider class="mt-4" />
      <v-card-text v-if="walletStore.account">
        <connected-wallet />
      </v-card-text>

      <v-card-text :style="{ overflowY: 'auto', maxHeight: '515px' }" v-else>
        <v-tabs align-tabs="center" color="primary" v-model="activeTab">
          <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
        </v-tabs>

        <div class="pt-6">
          <login-existed-wallet v-if="activeTab === 0 && tabs.length === 2" />
          <connect-wallet v-else />
        </div>
      </v-card-text>
    </v-card>
  </main>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

import { useWalletStore } from '@/stores'
import { WALLET_KEY } from '@/constants'

import ConnectWallet from '@/views/ConnectWallet.vue'
import ConnectedWallet from '@/views/ConnectedWallet.vue'
import LoginExistedWallet from '@/views/LoginExistedWallet.vue'
import { computed } from 'vue'

export default {
  name: 'tf-wallet-connector-extension',
  components: { ConnectWallet, ConnectedWallet, LoginExistedWallet },
  setup() {
    const activeTab = ref(0)
    const walletStore = useWalletStore()

    const tabs = computed(() => {
      walletStore.account
      return localStorage.getItem(WALLET_KEY) === null
        ? ['Connect Your Wallet']
        : ['Login', 'Connect Your Wallet']
    })

    onMounted(walletStore.init)

    return { activeTab, walletStore, tabs }
  }
}
</script>
