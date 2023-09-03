<template>
  <v-app :style="{ width: '535px', height: '600px' }">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useWalletStore } from '@/stores'
import { useVuetifyTheme } from '@/hooks'

export default {
  name: 'tf-wallet-connector-extension',
  setup() {
    const walletStore = useWalletStore()
    const theme = useVuetifyTheme()
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
      await router.isReady()

      const id = +(route.query.tabId || 0)
      const tabId = id > 0 ? id : undefined
      theme.value.load()
      walletStore.init(tabId)
    })

    return { walletStore }
  }
}
</script>
