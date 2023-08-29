<template>
  <v-text-field label="Mnemonic" readonly v-model="walletStore.account!.mnemonic" />

  <ssh-field v-model:loading="sshLoading" />

  <v-text-field label="Twin ID" readonly v-model="walletStore.account!.twinId" />
  <v-text-field label="Address" readonly v-model="walletStore.account!.address" />

  <div class="d-flex justify-end">
    <v-btn variant="outlined" color="error" :disabled="sshLoading" @click="walletStore.logout()">
      Logout
    </v-btn>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

import { useWalletStore } from '@/stores'

import SshField from '@/components/SshField.vue'

export default {
  name: 'ConnectedWallet',
  components: { SshField },
  setup() {
    const walletStore = useWalletStore()
    const sshLoading = ref(false)

    return { walletStore, sshLoading }
  }
}
</script>
