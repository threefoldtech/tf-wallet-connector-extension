<template>
  <main :style="{ width: '785px' }">
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
        {{ walletStore.account }}

        <div class="d-flex justify-end">
          <v-btn variant="outlined" color="error" @click="walletStore.logout()">Logout</v-btn>
        </div>
      </v-card-text>
      <v-card-text :style="{ overflowY: 'auto', height: '515px' }" v-else>
        <v-tabs align-tabs="center" color="primary" v-model="activeTab">
          <!-- <v-tab>Login</v-tab> -->
          <v-tab>Connect Your Wallet</v-tab>
        </v-tabs>

        <div class="pt-6">
          <connect-wallet />
        </div>
      </v-card-text>
    </v-card>
  </main>
</template>

<script lang="ts">
import { ref } from 'vue'

import ConnectWallet from '@/views/ConnectWallet.vue'
import { useWalletStore } from '@/stores'
import { onMounted } from 'vue'

export default {
  name: 'tf-wallet-connector-extension',
  components: { ConnectWallet },
  setup() {
    const activeTab = ref(0)
    const walletStore = useWalletStore()

    onMounted(walletStore.init)

    return { activeTab, walletStore }
  }
}
</script>
