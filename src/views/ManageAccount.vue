<template>
  <ext-layout>
    <account-chip :account="account" remove-actions />

    <ssh-field :account="account" />
  </ext-layout>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'

import { useWalletStore } from '@/stores'
import SshField from '@/components/SshField.vue'

export default {
  name: 'ManageAccount',
  components: { SshField },
  setup() {
    const walletStore = useWalletStore()
    const route = useRoute()

    const account = walletStore.findAccount(route.params.mnemonic as string)

    return { account }
  }
}
</script>
