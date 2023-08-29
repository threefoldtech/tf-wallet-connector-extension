<template>
  <tab-layout>
    <template #warning>
      To connect your wallet, you will need to enter your mnemonic which will be encrypted using the
      password. Mnemonic will never be shared outside of this device.
    </template>

    <form @submit.prevent="connect">
      <validate-field
        :value="mnemonic"
        :rules="[
          $validations.isRequired('Mnemonic is required.'),
          $validations.isValidMnemonic,
          $validations.isMnemonicHasTwin
        ]"
        required
        v-model="mnemonicValid"
        v-model:error="mnemonicError"
        v-model:validating="mnemonicValidating"
        :disabled="mnemonicDisabled"
        ref="mnemonicInput"
        #="{ validationProps }"
      >
        <password-field #="{ passwordFieldProps }">
          <v-text-field
            label="Mnemonic"
            placeholder="Please insert your Mnemonic"
            v-model="mnemonic"
            v-bind="$combineProps(passwordFieldProps, validationProps)"
            :disabled="mnemonicDisabled"
          />
        </password-field>
      </validate-field>

      <div class="d-flex justify-end mb-6">
        <v-btn
          variant="tonal"
          color="primary"
          class="mr-2"
          :disabled="!canActivateAccount"
          :loading="activatingAccount"
          @click="ShowTermsDialog = true"
        >
          Activate Account
        </v-btn>
        <v-btn
          variant="tonal"
          color="secondary"
          :disabled="!canGenerateAccount"
          @click="ShowTermsDialog = true"
          :loading="generatingAccount"
        >
          Generate Account
        </v-btn>
      </div>

      <validate-field
        :value="password"
        v-model="passwordValid"
        required
        :rules="[
          $validations.isRequired('Password is required.'),
          $validations.minLength('Password minLength is 6 chars.', 6)
        ]"
        #="{ validationProps }"
      >
        <password-field #="{ passwordFieldProps }">
          <v-text-field
            label="Password"
            v-model="password"
            v-bind="$combineProps(passwordFieldProps, validationProps)"
            :disabled="connecting"
          />
        </password-field>
      </validate-field>

      <validate-field
        :value="confirmPassword"
        v-model="confirmPasswordValid"
        required
        :rules="[
          $validations.isRequired('Confirm password is required.'),
          $validations.isMatch('Passwords must match each other.', () => password)
        ]"
        :deps="[password]"
        #="{ validationProps }"
      >
        <password-field #="{ passwordFieldProps }">
          <v-text-field
            label="Confirm Password"
            v-model="confirmPassword"
            v-bind="$combineProps(passwordFieldProps, validationProps)"
            :disabled="connecting"
          />
        </password-field>
      </validate-field>

      <button type="submit" hidden :disabled="!connectable" />
    </form>

    <template #actions>
      <v-btn
        variant="tonal"
        color="primary"
        :disabled="!connectable"
        type="submit"
        @click.prevent="connect"
        :loading="connecting"
      >
        Connect
      </v-btn>
    </template>
  </tab-layout>

  <terms-dialog
    v-model="ShowTermsDialog"
    @accept="canGenerateAccount ? generateAccount() : activateAccount()"
    v-if="ShowTermsDialog"
  />
</template>

<script lang="ts">
import { ref, computed } from 'vue'

import { createAccount, activateAccountAndCreateTwin } from '@/utils'
import { useValidateField } from '@/hooks'
import { useWalletStore } from '@/stores'

export default {
  name: 'ConnectWallet',
  setup() {
    const mnemonic = ref('')
    const mnemonicValid = ref(false)
    const mnemonicError = ref('')
    const mnemonicValidating = ref(false)
    const mnemonicDisabled = computed(() => generatingAccount.value || activatingAccount.value || connecting.value) // prettier-ignore
    const mnemonicInput = useValidateField()

    const canActivateAccount = computed(() => mnemonicError.value.toLowerCase().includes("couldn't find a user for the provided mnemonic")) // prettier-ignore
    const canGenerateAccount = computed(() => !mnemonicValid.value && !canActivateAccount.value && !mnemonicValidating.value) // prettier-ignore
    const ShowTermsDialog = ref(false)

    const generatingAccount = ref(false)
    async function generateAccount() {
      generatingAccount.value = true
      const account = await createAccount()
      mnemonic.value = account.mnemonic
      generatingAccount.value = false
    }

    const activatingAccount = ref(false)
    async function activateAccount() {
      activatingAccount.value = true
      await activateAccountAndCreateTwin(mnemonic.value)
      await mnemonicInput.value.validate()
      activatingAccount.value = false
    }

    const password = ref('')
    const passwordValid = ref(false)

    const confirmPassword = ref('')
    const confirmPasswordValid = ref(false)

    const connectable = computed(() => mnemonicValid.value && passwordValid.value && confirmPasswordValid.value) // prettier-ignore
    const connecting = ref(false)
    const walletStore = useWalletStore()
    async function connect() {
      connecting.value = true
      await walletStore.login(mnemonic.value)
      connecting.value = false
    }

    return {
      mnemonic,
      mnemonicValid,
      mnemonicError,
      mnemonicValidating,
      mnemonicDisabled,
      mnemonicInput,

      canActivateAccount,
      canGenerateAccount,
      ShowTermsDialog,

      generatingAccount,
      generateAccount,

      activatingAccount,
      activateAccount,

      password,
      passwordValid,

      confirmPassword,
      confirmPasswordValid,

      connectable,
      connecting,
      connect
    }
  }
}
</script>
