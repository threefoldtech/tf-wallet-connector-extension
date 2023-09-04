<template>
  <ext-layout remove-back remove-actions>
    <template #title>Restore accounts from JSON</template>

    <v-file-input
      label="Backup File"
      prepend-icon="mdi-code-json"
      accept="application/json"
      :model-value="backupFile"
      @update:model-value="onPickFile"
      :clearable="false"
      :error="!!fileError"
      :error-messages="fileError"
    />

    <template v-if="preview">
      <fieldset class="border pl-4 pt-2 mb-4">
        <legend class="ml-2 px-2 text-medium-emphasis">Accounts to restore</legend>
        <div class="overflow-y-auto pr-4" :style="{ maxHeight: '193px' }">
          <account-chip
            v-for="account in preview.accounts"
            :account="account"
            :key="account.address"
            remove-actions
          />
        </div>
      </fieldset>

      <form @submit.prevent="restoreAccounts()">
        <password-field #="{ passwordFieldProps }">
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
            <v-text-field
              label="Password to decrypt your accounts"
              v-bind="
                $combineProps(
                  passwordFieldProps,
                  validationProps,
                  restoreError ? { error: true, 'error-messages': restoreError } : {}
                )
              "
              :model-value="password"
              @update:model-value="
                ($event) => {
                  password = $event
                  if (restoreError) restoreError = ''
                }
              "
            />
          </validate-field>
        </password-field>

        <v-btn
          type="submit"
          variant="tonal"
          block
          color="error"
          class="mt-1"
          :disabled="!passwordValid"
        >
          Restore accounts
        </v-btn>
      </form>
    </template>
  </ext-layout>
</template>

<script lang="ts">
import { ref } from 'vue'

import md5 from 'md5'
import Cryptr from 'cryptr'

import { readBackupFile } from '@/utils'
import type { Account } from '@/types'
import { useWalletStore } from '@/stores'

export default {
  name: 'RestoreAccounts',
  setup() {
    const walletStore = useWalletStore()
    const backupFile = ref<File[]>([])
    const preview = ref<{ accounts: Account[]; encrypted: string } | null>(null)
    const fileError = ref('')
    async function onPickFile(files: File[]) {
      const file = files.at(0)

      if (!file) {
        if (backupFile.value.length === 0) {
          fileError.value = 'Please pick a file.'
        }
        return
      }

      if (!file || file.type !== 'application/json') {
        fileError.value = 'Backup must be a json file.'
        backupFile.value = []
        preview.value = null
        return
      }

      try {
        preview.value = await readBackupFile(file)
        backupFile.value = files
        fileError.value = ''
      } catch (err) {
        fileError.value = err as string
        backupFile.value = []
        preview.value = null
      }
    }

    const password = ref('')
    const passwordValid = ref(false)

    const restoreError = ref('')
    async function restoreAccounts() {
      const hash = md5(password.value)
      const cryptr = new Cryptr(hash, { pbkdf2Iterations: 10, saltLength: 10 })
      try {
        const accounts = JSON.parse(cryptr.decrypt(preview.value!.encrypted))
        await walletStore.restoreAccounts(accounts)
        window.close()
      } catch {
        restoreError.value = 'Please provide a valid password to decrypt your accounts data.'
      }
    }

    return {
      backupFile,
      preview,
      onPickFile,
      fileError,
      password,
      passwordValid,
      restoreError,
      restoreAccounts
    }
  }
}
</script>
