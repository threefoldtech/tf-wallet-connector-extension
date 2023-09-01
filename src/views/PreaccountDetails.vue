<template>
  <ext-layout :disable-actions="loading || addingAccount">
    <template #title>Import account</template>

    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular indeterminate color="primary" size="30" class="my-10" />
    </div>

    <template v-else>
      <account-chip :account="fakeAccount" remove-actions />
      <form @submit.prevent="addAccount">
        <validate-field
          :value="name"
          :rules="[
            $validations.isRequired('Account name is required.'),
            $validations.minLength('Account name minLength is 3 chars.', 3)
          ]"
          required
          v-model="nameValid"
          #="{ validationProps }"
        >
          <v-text-field
            label="Account name"
            :disabled="addingAccount"
            autofocus
            v-model="name"
            v-bind="validationProps"
          />
        </validate-field>

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
              :disabled="addingAccount"
              v-bind="$combineProps(passwordFieldProps, validationProps)"
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
              :disabled="addingAccount"
            />
          </password-field>
        </validate-field>

        <v-btn
          type="submit"
          :disabled="!formValid"
          :loading="addingAccount"
          variant="tonal"
          block
          color="primary"
        >
          Import account
        </v-btn>
      </form>

      <div class="mt-2 d-flex justify-center">
        <v-btn variant="plain" @click="$router.push('/')" :disabled="!addingAccount">
          Cancel
        </v-btn>
      </div>
    </template>
  </ext-layout>
</template>

<script lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { loadGrid } from '@/utils'
import type { Account } from '@/types'
import { useWalletStore } from '@/stores'

export default {
  name: 'PreaccountDetails',
  setup() {
    const route = useRoute()
    const mnemonic = route.params.mnemonic as string
    const loading = ref(true)
    const fakeAccount = ref() as Ref<Account>

    onMounted(async () => {
      const grid = await loadGrid(mnemonic)
      fakeAccount.value = {
        name: '<unknown>',
        mnemonic,
        address: grid.tfclient.address
      } as Account
      await grid.disconnect()
      loading.value = false
    })

    const router = useRouter()
    const walletStore = useWalletStore()

    const name = ref('')
    const nameValid = ref(false)

    const password = ref('')
    const passwordValid = ref(false)

    const confirmPassword = ref('')
    const confirmPasswordValid = ref(false)

    const formValid = computed(() => nameValid.value && passwordValid.value && confirmPasswordValid.value) // prettier-ignore

    const addingAccount = ref(false)
    async function addAccount() {
      addingAccount.value = true
      await walletStore.addAccount(name.value, mnemonic, password.value)
      addingAccount.value = false
      router.push('/')
    }

    return {
      fakeAccount,

      name,
      nameValid,
      password,
      passwordValid,
      confirmPassword,
      confirmPasswordValid,
      formValid,
      addAccount,
      loading,
      addingAccount
    }
  }
}
</script>
