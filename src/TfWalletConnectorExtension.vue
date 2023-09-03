<template>
  <v-app :style="{ width: '535px', height: '600px' }">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { onMounted } from 'vue'

import { useWalletStore } from '@/stores'
import { useVuetifyTheme } from '@/hooks'

export default {
  name: 'tf-wallet-connector-extension',
  setup() {
    const walletStore = useWalletStore()
    const theme = useVuetifyTheme()

    onMounted(() => {
      theme.value.load()
      walletStore.init()
    })

    return { walletStore }
  }
}
</script>
