<template>
  <ext-layout :remove-back="sshLoading" remove-actions>
    <template #title>Create new account</template>

    <h3 class="mb-8">Insert your public ssh key</h3>

    <v-alert type="warning" variant="tonal" class="mb-4">
      Public ssh key will be required in some cases. If you are aware of the you go ahead and skip
      inserting it.
    </v-alert>

    <ssh-field
      no-password
      :account="fakeAccount"
      :networks="networks"
      v-model:loading="sshLoading"
      v-model:public-ssh="fakeAccount.ssh"
      :disabled="loading"
    />

    <v-btn
      variant="tonal"
      color="primary"
      block
      :disabled="sshLoading"
      @click="createAccount"
      :loading="loading"
    >
      Create Account
    </v-btn>
  </ext-layout>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'

import SshField from '@/components/SshField.vue'
import type { Account } from '@/types'
import { ref } from 'vue'
import { useWalletStore } from '@/stores'
import { computed } from 'vue'

export default {
  name: 'CreateAccountSSH',
  components: { SshField },
  setup() {
    const route = useRoute()
    const walletStore = useWalletStore()
    const loading = ref(false)

    const account = route.params as unknown as Account & { password: string }
    const fakeAccount = ref({
      ...account,
      ssh: ''
    })

    const sshLoading = ref(false)

    const networks = computed(() => {
      return (route.params.networks as string).split('-')
    })

    async function createAccount() {
      loading.value = true
      await walletStore.addAccount({
        name: account.name,
        mnemonic: account.mnemonic,
        networks: networks.value,
        password: account.password,
        keypairType: account.keypairType
      })
      loading.value = false
      window.onbeforeunload = null
      window.close()
    }

    return {
      fakeAccount,

      sshLoading,
      createAccount,
      networks,
      loading
    }
  }
}
</script>
