<template>
  <main :style="{ width: '800px' }">
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
      <v-card-text>
        <v-tabs align-tabs="center" color="primary" v-model="activeTab">
          <v-tab>Login</v-tab>
          <v-tab>Connect Your Wallet</v-tab>
        </v-tabs>

        <div class="pt-6">
          <connect-wallet />
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-end">
        <v-btn variant="tonal" color="primary">Connect</v-btn>
      </v-card-actions>
    </v-card>
  </main>
</template>

<script lang="ts">
import ConnectWallet from '@/views/ConnectWallet.vue'
import { ref } from 'vue'

export default {
  name: 'tf-wallet-connector-extension',
  components: { ConnectWallet },
  setup() {
    const activeTab = ref(0)

    return { activeTab }
  }
}
</script>
