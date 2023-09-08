<template>
  <ext-layout>
    <template #title>Manage account</template>

    <account-chip :account="account" remove-actions />

    <div
      :style="{ height: '366px', marginRight: '-16px', paddingRight: '16px' }"
      class="overflow-y-auto"
    >
      <form @submit.prevent="checkPassword" v-if="!mnemonic">
        <validate-field
          :value="password"
          :rules="[
            $validations.isRequired('Account password is required.'),
            $validations.minLength('Account password minLength is 6 chars.', 6)
          ]"
          required
          #="{ validationProps }"
          v-model="passwordValid"
        >
          <password-field #="{ passwordFieldProps }">
            <v-text-field
              label="Account Password"
              placeholder="Your account password"
              :model-value="password"
              @update:model-value="
                ($event) => {
                  password = $event
                  if (passwordError) {
                    passwordError = ''
                  }
                }
              "
              autofocus
              v-bind="$combineProps(validationProps, passwordFieldProps)"
            />
          </password-field>
        </validate-field>

        <v-alert variant="tonal" color="error" class="mb-4" v-if="passwordError">
          {{ passwordError }}
        </v-alert>
        <div class="d-flex justify-center">
          <v-btn color="primary" type="submit" :disabled="!passwordValid" variant="tonal">
            Manage Account
          </v-btn>
        </div>
      </form>

      <template v-else>
        <h3 class="mt-8 mb-2 text-display-1 font-weight-regular text-decoration-underline">
          Manage Account Public SSH key
        </h3>

        <v-tabs align-tabs="center" color="primary" v-model="currentTab">
          <v-tab>Update</v-tab>
          <v-tab>Sync</v-tab>
          <v-tab>Read</v-tab>
        </v-tabs>
        <v-divider class="mb-4" />

        <manage-ssh :account="account" v-if="currentTab === 0" />
        <sync-ssh :account="account" v-if="currentTab === 1" />
        <read-ssh :account="account" v-else-if="currentTab === 2" />
      </template>
    </div>
  </ext-layout>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import md5 from 'md5'
import Cryptr from 'cryptr'

import { useWalletStore } from '@/stores'
// import SshField from '@/components/SshField.vue'

import ManageSsh from '@/components/ManageSsh.vue'
import SyncSsh from '@/components/SyncSsh.vue'
import ReadSsh from '@/components/ReadSsh.vue'

export default {
  name: 'ManageAccount',
  components: { /* SshField */ ManageSsh, SyncSsh, ReadSsh },
  setup() {
    const walletStore = useWalletStore()
    const route = useRoute()
    const currentTab = ref(0)
    const password = ref('')
    const passwordError = ref('')
    const passwordValid = ref(false)
    const mnemonic = ref('')

    const account = walletStore.findAccount(route.params.mnemonic as string)

    function checkPassword() {
      const cryptr = new Cryptr(md5(password.value), { pbkdf2Iterations: 10, saltLength: 10 })
      try {
        mnemonic.value = cryptr.decrypt(account.mnemonic)
      } catch {
        passwordError.value = "Password you provided isn't valid"
      }
    }

    return {
      account: computed(() => ({ ...account, mnemonic: mnemonic.value })),
      currentTab,
      password,
      passwordError,
      passwordValid,
      checkPassword,
      mnemonic
    }
  }
}
</script>
