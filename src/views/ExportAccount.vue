<template>
  <export-layout
    password-label="Password to encrypt your account"
    v-model="password"
    :account="account"
    @export="exportAccount"
  >
    <template #title>Export account</template>
    <template #warning>
      You are exporting your account. Keep it safe and don't share it with anyone.
    </template>
  </export-layout>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import md5 from 'md5'
import Cryptr from 'cryptr'

import ExportLayout from '@/components/ExportLayout.vue'
import { useWalletStore } from '@/stores'
import { downloadAsFile } from '@/utils'
import { VERSION } from '@/constants'

export default {
  name: 'ExportAccount',
  components: { ExportLayout },
  setup() {
    const walletStore = useWalletStore()
    const route = useRoute()
    const { mnemonic } = route.params as { mnemonic: string }
    const account = walletStore.findAccount(mnemonic)

    const password = ref('')

    function exportAccount(next: () => void) {
      const hash = md5(password.value)
      const cryptr = new Cryptr(hash, { saltLength: 10, pbkdf2Iterations: 10 })
      const encryptedAccount = cryptr.encrypt(JSON.stringify(account))
      downloadAsFile(
        account.name.toLowerCase() + '.json',
        JSON.stringify({
          encrypted: encryptedAccount,
          address: account.address,
          meta: { version: VERSION, extension: window.$TF_WALLET_CONNECTOR_EXTENSION }
        })
      )
      next()
    }

    return { account, password, exportAccount }
  }
}
</script>