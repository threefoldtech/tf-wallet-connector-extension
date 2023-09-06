<template>
  <ext-layout :disable-actions="loading" remove-actions>
    <template #title>Create new account</template>

    <h3 class="mb-8">Activate account on network</h3>

    <join-networks
      :mnemonic="accountMnemonic"
      v-model="networks"
      v-model:valid="networkValid"
      v-model:loading="networkLoading"
    />
    {{ networks }} - {{ networkValid }} - {{ networkLoading }}
    <!-- <v-combobox
      label="Networks to join"
      :items="['main', 'test', 'qa', 'dev']"
      v-model="networks"
      multiple
      :item-title="(item) => item[0].toUpperCase() + item.slice(1) + 'net'"
    >
      <template #selection="{ item }">
        <v-chip color="primary" size="small" class="rounded-sm mr-1 font-weight-bold">
          {{ item.title }}
        </v-chip>
      </template>
    </v-combobox> -->

    <v-checkbox
      label="I have stored my mnemonic, password and ready to activate my account on network."
      color="secondary"
      v-model="done"
      :disabled="loading"
      hide-details
    />

    <v-alert type="error" variant="tonal" class="mb-4" v-if="error">{{ error }}</v-alert>
  </ext-layout>

  <terms-dialog v-model="ShowTermsDialog" @accept="activateAccount()" v-if="ShowTermsDialog" />
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activateAccountAndCreateTwin } from '@/utils'

import JoinNetworks from '@/components/JoinNetworks.vue'

export default {
  name: 'CreateAccountTwin',
  components: { JoinNetworks },
  setup() {
    const done = ref(false)
    const loading = ref(false)
    const route = useRoute()
    const router = useRouter()
    const networks = ref<string[]>([])
    const networkLoading = ref(false)
    const networkValid = ref(false)

    const ShowTermsDialog = ref(false)

    const error = ref('')
    async function activateAccount() {
      error.value = ''
      try {
        loading.value = true
        const account = route.params as { name: string; mnemonic: string; password: string }
        await activateAccountAndCreateTwin(account.mnemonic)
        router.push(`/create-account-ssh/${account.mnemonic}/${account.name}/${account.password}`)
      } catch (err) {
        error.value = (err as Error).message
      } finally {
        loading.value = false
      }
    }

    return {
      done,
      loading,
      activateAccount,
      error,
      ShowTermsDialog,
      networks,
      networkLoading,
      networkValid,
      accountMnemonic: route.params.mnemonic as string
    }
  }
}
</script>
