<template>
  <v-app :style="{ width: '485px' }">
    <ext-layout v-model:search="search">
      <template #title>Accounts</template>
    </ext-layout>
  </v-app>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'

import { useWalletStore } from '@/stores'
import { useVuetifyTheme } from '@/hooks'

export default {
  name: 'tf-wallet-connector-extension',
  setup() {
    const walletStore = useWalletStore()
    const theme = useVuetifyTheme()
    const search = ref('')

    onMounted(() => {
      theme.value.load()
      walletStore.init()
    })

    return { walletStore, search }
  }
}
</script>
