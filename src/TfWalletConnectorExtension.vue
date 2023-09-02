<template>
  <v-app :style="{ width: '535px' }">
    <router-view />
    <v-btn @click="openPage">Open Notification Page</v-btn>
  </v-app>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useWalletStore } from '@/stores'
import { useVuetifyTheme } from '@/hooks'

export default {
  name: 'tf-wallet-connector-extension',
  setup() {
    const walletStore = useWalletStore()
    const theme = useVuetifyTheme()
    const router = useRouter()

    onMounted(() => {
      theme.value.load()
      walletStore.init()

      // prettier-ignore
      const pagesRequiresQuery = [
        { query: 'request-access', url: '/request-access' }
      ]

      const url = new URL(window.location.href)
      const query = new Set(url.searchParams.keys())
      for (const page of pagesRequiresQuery) {
        if (query.has(page.query)) {
          router.push(page.url)
          break
        }
      }
    })

    function openPage() {
      window.open(
        'chrome-extension://mopnmbcafieddcagagdcbnhejhlodfdd/index.html#/',
        'popuppage',
        'top=0,left=0,height=600,width=535,toolbar=no'
      )
    }

    return { walletStore, openPage }
  }
}
</script>
