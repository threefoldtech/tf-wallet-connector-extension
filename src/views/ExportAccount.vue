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
    <template #export-label>Export account</template>
  </export-layout>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
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
    const router = useRouter()

    const { mnemonic } = route.params as { mnemonic: string }
    const account = walletStore.findAccount(mnemonic)

    const password = ref('')

    function exportAccount() {
      const hash = md5(password.value)
      const cryptr = new Cryptr(hash, { saltLength: 10, pbkdf2Iterations: 10 })
      const encryptedAccounts = cryptr.encrypt(JSON.stringify([account]))
      downloadAsFile(
        account.name.toLowerCase() + '.json',
        JSON.stringify({
          encrypted: encryptedAccounts,
          accounts: [
            {
              name: account.name,
              address: account.address,
              networks: account.networks,
              keypairType: account.keypairType
            }
          ],
          meta: { version: VERSION, extension: 'TF_WALLET_CONNECTOR_EXTENSION' }
        })
      )
      router.push('/')
    }

    return { account, password, exportAccount }
  }
}
</script>
