<template>
  <ext-layout remove-back remove-actions>
    <template #title>Select account to decrypt</template>

    <v-alert type="info" variant="tonal">
      `{{ $route.query.url || '' }}` requesting a decrypted account to use
    </v-alert>

    <v-switch
      color="primary"
      inset
      label="Show public accounts only"
      v-model="onlyPublic"
      class="mt-4"
    />

    <v-list>
      <template v-for="account in accounts" :key="account.address">
        <v-list-item @click="selectedAccount = account" class="pt-4">
          <account-chip :account="account" remove-actions />
        </v-list-item>
        <v-divider />
      </template>
    </v-list>

    <v-dialog
      :model-value="!!selectedAccount"
      @update:model-value="
        () => {
          selectedAccount = undefined
          password = ''
          passwordError = ''
        }
      "
    >
      <v-card>
        <v-card-text>
          <v-card-title>Enter password to decrypt account</v-card-title>
          <v-divider class="mb-4" />

          <form @submit.prevent="decryptAndSend">
            <password-field #="{ passwordFieldProps }">
              <validate-field
                :rules="[
                  $validations.isRequired('Account password is required.'),
                  $validations.minLength('Account password minLength is 6 chars.', 6)
                ]"
                required
                :value="password"
                v-model="passwordValid"
                #="{ validationProps }"
              >
                <v-text-field
                  autofocus
                  label="Account password to decrypt"
                  :model-value="password"
                  @update:model-value="
                    ($event) => {
                      password = $event
                      if (passwordError) {
                        passwordError = ''
                      }
                    }
                  "
                  v-bind="$combineProps(validationProps, passwordFieldProps)"
                />
              </validate-field>
            </password-field>

            <v-alert type="error" variant="tonal" class="mb-4" v-if="passwordError">
              {{ passwordError }}
            </v-alert>

            <div class="d-flex justify-center">
              <v-btn color="error" variant="tonal" type="submit" :disabled="!passwordValid">
                Submit
              </v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </ext-layout>
</template>

<script lang="ts">
import { useWalletStore } from '@/stores'
import type { Account } from '@/types'
import { sendMessageToContent } from '@/utils'
import { ref } from 'vue'
import md5 from 'md5'
import Cryptr from 'cryptr'
import { computed } from 'vue'

export default {
  name: 'SelectDecryptedAccount',
  setup() {
    const walletStore = useWalletStore()
    const selectedAccount = ref<Account>()
    const password = ref('')
    const passwordValid = ref(false)
    const passwordError = ref('')
    const onlyPublic = ref(true)

    let _done = false
    async function decryptAndSend() {
      const hashPassword = md5(password.value)
      const cryptr = new Cryptr(hashPassword, { saltLength: 10, pbkdf2Iterations: 10 })

      try {
        const mnemonic = cryptr.decrypt(selectedAccount.value!.mnemonic)
        await sendMessageToContent('SELECT_DECRYPTED_ACCOUNT', {
          ...selectedAccount.value,
          mnemonic
        })
        _done = true
        window.close()
      } catch {
        passwordError.value = "Password you provided isn't valid"
      }
    }

    window.addEventListener('beforeunload', () => {
      if (_done) return
      sendMessageToContent('SELECT_DECRYPTED_ACCOUNT', null)
    })

    const accounts = computed(() => {
      if (onlyPublic.value) {
        return walletStore.accounts.filter((account) => account.visible)
      }
      return walletStore.accounts
    })

    return {
      walletStore,
      selectedAccount,
      password,
      passwordValid,
      passwordError,
      decryptAndSend,
      onlyPublic,
      accounts
    }
  }
}
</script>
