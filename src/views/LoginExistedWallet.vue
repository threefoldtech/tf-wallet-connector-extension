<template>
  <tab-layout>
    <template #warning>
      You will need to provide the password used while connecting your wallet.
    </template>

    <form @submit.prevent="login">
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
            :model-value="password"
            @update:model-value="
              ($event) => {
                password = $event
                if (passwordError) {
                  passwordError = ''
                }
              }
            "
            v-bind="$combineProps(passwordFieldProps, validationProps)"
            :disabled="loading"
          />
        </password-field>
      </validate-field>

      <v-alert type="error" variant="tonal" v-if="passwordError">
        {{ passwordError }}
      </v-alert>

      <button type="submit" hidden :disabled="!passwordValid" />
    </form>

    <template #actions>
      <v-btn
        variant="tonal"
        color="primary"
        :disabled="!passwordValid"
        type="submit"
        @click.prevent="login"
        :loading="loading"
      >
        Login
      </v-btn>
    </template>
  </tab-layout>
</template>

<script lang="ts">
import { ref } from 'vue'

import { readLocalWallet } from '@/utils'
import { useWalletStore } from '@/stores'

export default {
  name: 'LoginExistedWallet',
  setup() {
    const walletStore = useWalletStore()

    const password = ref('')
    const passwordValid = ref(false)
    const passwordError = ref('')

    const loading = ref(false)
    async function login() {
      loading.value = true
      try {
        const wallet = readLocalWallet(password.value)
        await walletStore.login(wallet)
      } catch (error) {
        passwordError.value = (error as Error).message
      }
      loading.value = false
    }

    return {
      password,
      passwordValid,
      passwordError,

      loading,
      login
    }
  }
}
</script>
