<template>
  <ext-layout :disable-actions="loading" remove-actions>
    <template #title>Import account</template>

    <form @submit.prevent="$router.push('/import-preaccount/' + mnemonic)">
      <validate-field
        :value="mnemonic"
        :rules="[
          $validations.isRequired('Mnemonic is required.'),
          $validations.isValidMnemonic,
          $validations.isMnemonicHasTwin
        ]"
        required
        v-model:error="mnemonicError"
        v-model="mnemonicValid"
        ref="mnemonicInput"
        #="{ validationProps }"
        :disabled="loading"
      >
        <v-textarea
          label="Your account mnemonic"
          no-resize
          autofocus
          rows="2"
          v-model="mnemonic"
          v-bind="validationProps"
          :disabled="loading"
        />
      </validate-field>

      <v-btn
        type="button"
        :disabled="
          !mnemonicError.toLowerCase().includes('couldn\'t find a user for the provided mnemonic')
        "
        variant="tonal"
        block
        color="secondary"
        class="mt-1 mb-2"
        :loading="loading"
        @click="ShowTermsDialog = true"
      >
        Activate account
      </v-btn>

      <v-btn type="submit" :disabled="!mnemonicValid" variant="tonal" block color="primary">
        Next step
      </v-btn>
    </form>
  </ext-layout>

  <terms-dialog v-model="ShowTermsDialog" @accept="activate()" v-if="ShowTermsDialog" />
</template>

<script lang="ts">
import { ref } from 'vue'

import { useValidateField } from '@/hooks'
import { activateAccountAndCreateTwin } from '@/utils'

export default {
  name: 'ImportPreaccount',
  setup() {
    const mnemonic = ref('')
    const mnemonicValid = ref(false)
    const mnemonicError = ref('')
    const mnemonicInput = useValidateField()

    const ShowTermsDialog = ref(false)

    const loading = ref(false)
    async function activate() {
      loading.value = true
      await activateAccountAndCreateTwin(mnemonic.value)
      await mnemonicInput.value.validate()
      loading.value = false
    }

    return {
      mnemonic,
      mnemonicValid,
      mnemonicError,
      mnemonicInput,

      loading,
      activate,

      ShowTermsDialog
    }
  }
}
</script>
