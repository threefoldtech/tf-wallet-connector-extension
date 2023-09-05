<template>
  <ext-layout :disable-actions="loading" remove-actions>
    <template #title>Create new account</template>

    <h3 class="mb-8">Activate account on network</h3>

    <v-checkbox
      label="I have stored my mnemonic, password and ready to activate my account on network."
      color="secondary"
      v-model="done"
      :disabled="loading"
    />

    <v-alert type="error" variant="tonal" class="mb-4" v-if="error">{{ error }}</v-alert>

    <v-btn
      type="submit"
      color="primary"
      variant="tonal"
      block
      size="large"
      :disabled="!done"
      :loading="loading"
      @click="ShowTermsDialog = true"
    >
      Activate my account
    </v-btn>
  </ext-layout>

  <terms-dialog v-model="ShowTermsDialog" @accept="activateAccount()" v-if="ShowTermsDialog" />
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activateAccountAndCreateTwin } from '@/utils'
import { useWalletStore } from '@/stores'

export default {
  name: 'CreateAccountTwin',
  setup() {
    const done = ref(false)
    const loading = ref(false)
    const walletStore = useWalletStore()
    const route = useRoute()
    const router = useRouter()

    const ShowTermsDialog = ref(false)

    const error = ref('')
    async function activateAccount() {
      error.value = ''
      try {
        loading.value = true
        const account = route.params as { name: string; mnemonic: string; password: string }
        await activateAccountAndCreateTwin(account.mnemonic)
        await walletStore.addAccount(account.name, account.mnemonic, account.password)
        router.push('/')
      } catch (err) {
        error.value = (err as Error).message
      } finally {
        loading.value = false
      }
    }

    return { done, loading, activateAccount, error, ShowTermsDialog }
  }
}
</script>
