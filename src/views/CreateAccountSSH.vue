<template>
  <ext-layout :remove-back="sshLoading" remove-actions>
    <template #title>Create new account</template>

    <h3 class="mb-8">Insert your public ssh key</h3>

    <v-alert type="warning" variant="tonal" class="mb-4">
      Public ssh key will be required in some cases. If you are aware of the you go ahead and skip
      inserting it.
    </v-alert>

    <ssh-field no-password :account="fakeAccount" v-model:loading="sshLoading" />

    <v-btn variant="tonal" color="primary" block :disabled="sshLoading" @click="createAccount">
      Create Account
    </v-btn>
  </ext-layout>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'

import SshField from '@/components/SshField.vue'
import type { Account } from '@/types'
import { ref } from 'vue'
import { useWalletStore } from '@/stores'

export default {
  name: 'CreateAccountSSH',
  components: { SshField },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const walletStore = useWalletStore()

    const account = route.params as unknown as Account & { password: string }

    const sshLoading = ref(false)

    async function createAccount() {
      await walletStore.addAccount(account.name, account.mnemonic, account.password)
      router.push('/')
    }

    return {
      fakeAccount: {
        ...account,
        ssh: ''
      },

      sshLoading,
      createAccount
    }
  }
}
</script>
