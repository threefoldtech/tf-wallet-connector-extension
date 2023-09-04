<template>
  <ext-layout>
    <template #title>Forget Account</template>
    <account-chip :account="account" remove-actions />
    <v-alert type="warning" variant="tonal">
      You are about to remove the account. This means that you will not be able to access it via
      this extension anymore. If you wish to recover it, you would need to use the seed.
    </v-alert>
    <v-btn variant="tonal" color="error" block class="mt-4" @click="forgetAccount">
      Forget Account
    </v-btn>
  </ext-layout>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'

import { useWalletStore } from '@/stores'

export default {
  name: 'ForgetAccount',
  setup() {
    const walletStore = useWalletStore()
    const route = useRoute()
    const router = useRouter()
    const { mnemonic } = route.params as { mnemonic: string }
    const account = walletStore.findAccount(mnemonic)

    function forgetAccount() {
      walletStore.forgetAccount(mnemonic)
      router.push('/')
    }

    return { account, forgetAccount }
  }
}
</script>
