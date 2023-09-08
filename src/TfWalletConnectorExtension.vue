<template>
  <v-app :style="{ width: '535px', height: '600px' }">
    <div v-if="loading" class="d-flex justify-center align-center my-12 py-12">
      <v-progress-circular indeterminate />
    </div>
    <router-view v-else />
  </v-app>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useWalletStore } from '@/stores'
import { useVuetifyTheme } from '@/hooks'
import { initTabId } from '@/utils'
import { ref } from 'vue'

export default {
  name: 'tf-wallet-connector-extension',
  setup() {
    const loading = ref(false)
    const walletStore = useWalletStore()
    const theme = useVuetifyTheme()
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
      loading.value = true
      await router.isReady()

      const id = +(route.query.tabId || 0)
      const tabId = id > 0 ? id : undefined
      initTabId(tabId)

      theme.value.load()
      await walletStore.init()
      loading.value = false
    })

    return { loading }
  }
}
</script>
