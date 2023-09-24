<template>
  <ext-layout :disable-actions="networkLoading" remove-actions>
    <template #title>Import account</template>

    <form
      @submit.prevent="
        $router.push(`/import-preaccount/${mnemonic}/${keypairType}/${networks.join('-')}`)
      "
    >
      <validate-field
        :value="mnemonic"
        :rules="[$validations.isRequired('Mnemonic is required.'), $validations.isValidMnemonic]"
        required
        v-model:error="mnemonicError"
        v-model="mnemonicValid"
        ref="mnemonicInput"
        #="{ validationProps }"
        :disabled="networkLoading"
      >
        <v-textarea
          label="Your account mnemonic"
          no-resize
          autofocus
          rows="2"
          v-model="mnemonic"
          v-bind="validationProps"
          :disabled="networkLoading"
        />
      </validate-field>

      <v-select label="Keypair Type" :items="['sr25519', 'ed25519']" v-model="keypairType" />

      <join-networks
        :key="mnemonic"
        check-only
        :disabled="!mnemonicValid"
        :mnemonic="mnemonic"
        v-model="networks"
        v-model:valid="networkValid"
        v-model:loading="networkLoading"
      />

      <v-btn
        type="submit"
        class="mt-4"
        size="large"
        :disabled="!mnemonicValid || !networkValid"
        variant="tonal"
        block
        color="primary"
      >
        Next step
      </v-btn>
    </form>
  </ext-layout>
</template>

<script lang="ts">
import { ref } from 'vue'

import { useValidateField } from '@/hooks'

import JoinNetworks from '@/components/JoinNetworks.vue'

export default {
  name: 'ImportPreaccount',
  components: { JoinNetworks },
  setup() {
    const mnemonic = ref('')
    const mnemonicValid = ref(false)
    const mnemonicError = ref('')
    const mnemonicInput = useValidateField()

    const keypairType = ref('sr25519')

    const ShowTermsDialog = ref(false)

    const networks = ref<string[]>([])
    const networkValid = ref(false)
    const networkLoading = ref(false)

    return {
      mnemonic,
      mnemonicValid,
      mnemonicError,
      mnemonicInput,

      keypairType,

      ShowTermsDialog,

      networks,
      networkValid,
      networkLoading
    }
  }
}
</script>
