<template>
  <ext-layout :disable-actions="networkLoading" :remove-back="networkLoading" remove-actions>
    <template #title>Create new account</template>

    <h3 class="mb-8">Activate account on network</h3>

    <join-networks
      :mnemonic="accountMnemonic"
      v-model="networks"
      v-model:valid="networkValid"
      v-model:loading="networkLoading"
    />

    <v-checkbox
      class="mt-4"
      label="I have stored my mnemonic, password and ready to activate my account on network."
      color="secondary"
      v-model="done"
      hide-details
      :disabled="networkLoading"
    />

    <v-btn
      color="primary"
      variant="tonal"
      size="large"
      block
      class="mt-4"
      :disabled="!networkValid || !done"
    >
      Join select networks
    </v-btn>
  </ext-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import JoinNetworks from '@/components/JoinNetworks.vue'

export default {
  name: 'CreateAccountTwin',
  components: { JoinNetworks },
  setup() {
    const done = ref(false)
    const route = useRoute()
    const router = useRouter()
    const networks = ref<string[]>([])
    const networkLoading = ref(false)
    const networkValid = ref(false)

    async function activateAccount() {
      const account = route.params as { name: string; mnemonic: string; password: string }
      router.push(`/create-account-ssh/${account.mnemonic}/${account.name}/${account.password}`)
    }

    return {
      done,
      activateAccount,
      networks,
      networkLoading,
      networkValid,
      accountMnemonic: route.params.mnemonic as string
    }
  }
}
</script>
