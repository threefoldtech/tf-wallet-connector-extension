<template>
  <export-layout
    password-label="Password to encrypt your accounts"
    v-model="password"
    @export="exportAccounts"
  >
    <template #title>Export all accounts</template>
    <template #warning>
      You are exporting your accounts. Keep them safe and don't share them with anyone.
    </template>
    <template #export-label>Export all accounts</template>
  </export-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import md5 from 'md5'
import Cryptr from 'cryptr'
import { useRouter } from 'vue-router'

import ExportLayout from '@/components/ExportLayout.vue'
import { useWalletStore } from '@/stores'
import { downloadAsFile } from '@/utils'
import { VERSION } from '@/constants'

export default {
  name: 'ExportAccount',
  components: { ExportLayout },
  setup() {
    const walletStore = useWalletStore()
    const password = ref('')
    const router = useRouter()

    function exportAccounts() {
      const hash = md5(password.value)
      const cryptr = new Cryptr(hash, { saltLength: 10, pbkdf2Iterations: 10 })
      const encryptedAccounts = cryptr.encrypt(JSON.stringify(walletStore.accounts))
      downloadAsFile(
        'accounts.json',
        JSON.stringify({
          encrypted: encryptedAccounts,
          accounts: walletStore.accounts.map((account) => ({
            name: account.name,
            address: account.address,
            networks: account.networks
          })),
          meta: { version: VERSION, extension: 'TF_WALLET_CONNECTOR_EXTENSION' }
        })
      )
      router.push('/')
    }

    return { password, exportAccounts }
  }
}
</script>
