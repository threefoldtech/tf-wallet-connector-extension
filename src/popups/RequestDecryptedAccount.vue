<template>
  <ext-layout remove-back remove-actions>
    <template #title>Request decrypted account</template>
    <p>Do you want to give `{{ $route.query.url || '' }}` access to your decrypted account?</p>

    <form @submit.prevent="giveAccess">
      <v-text-field
        label="Account password"
        type="password"
        :model-value="password"
        autofocus
        :disabled="loading"
        @update:model-value="
          ($event) => {
            password = $event
            if (mnemonicError) {
              mnemonicError = ''
            }
          }
        "
      />

      <v-alert type="error" variant="tonal" class="mb-4" v-if="mnemonicError">
        {{ mnemonicError }}
      </v-alert>

      <v-btn type="submit" :loading="loading" variant="tonal" block color="error" class="mt-1">
        Give Access
      </v-btn>
    </form>
  </ext-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import md5 from 'md5'
import Cryptr from 'cryptr'
import { sendMessageToContent, loadPublicAccount } from '@/utils'
import { useWalletStore } from '@/stores'

export default {
  name: 'RequestDecryptedAccount',
  setup() {
    const walletStore = useWalletStore()
    const route = useRoute()
    const password = ref('')
    const mnemonicError = ref('')
    const loading = ref(false)

    const encryptedMnemonic = route.params.mnemonic as string
    const selectedNetworks = route.params.networks === 'none' ? null : (route.params.networks as string).split('-') // prettier-ignore
    const selectedAccount = walletStore.findAccount(encryptedMnemonic)

    let _done = false
    async function giveAccess() {
      loading.value = true
      const hashPassword = md5(password.value)
      const cryptr = new Cryptr(hashPassword, { pbkdf2Iterations: 10, saltLength: 10 })

      try {
        const mnemonic = cryptr.decrypt(encryptedMnemonic)

        const networks = selectedNetworks
          ? selectedAccount.networks.filter((network) => selectedNetworks.includes(network))
          : selectedAccount.networks

        await sendMessageToContent(
          'REQUEST_DECRYPTED_ACCOUNT',
          await loadPublicAccount({
            name: selectedAccount.name,
            address: selectedAccount.address,
            encryptedMnemonic: false,
            mnemonic,
            networks
          })
        )
        _done = true
        window.onbeforeunload = null
        window.close()
      } catch {
        mnemonicError.value = 'Please provide a valid password.'
        loading.value = false
      }
    }

    window.addEventListener('beforeunload', async () => {
      if (_done) return
      await sendMessageToContent('REQUEST_DECRYPTED_ACCOUNT', null)
    })

    return { password, giveAccess, mnemonicError, loading }
  }
}
</script>
