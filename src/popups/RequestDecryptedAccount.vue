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

      <v-btn type="submit" variant="tonal" block color="error" class="mt-1"> Give Access </v-btn>
    </form>
  </ext-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import md5 from 'md5'
import Cryptr from 'cryptr'
import { sendMessageToContent } from '@/utils'

export default {
  name: 'RequestDecryptedAccount',
  setup() {
    const route = useRoute()
    const password = ref('')
    const mnemonicError = ref('')

    let _done = false
    async function giveAccess() {
      const hashPassword = md5(password.value)
      const cryptr = new Cryptr(hashPassword, { pbkdf2Iterations: 10, saltLength: 10 })

      try {
        const mnemonic = cryptr.decrypt(route.params.mnemonic as string)
        await sendMessageToContent('REQUEST_DECRYPTED_ACCOUNT', mnemonic)
        _done = true
        window.close()
      } catch {
        mnemonicError.value = 'Please provide a valid password.'
      }
    }

    window.addEventListener('beforeunload', async () => {
      if (_done) return
      await sendMessageToContent('REQUEST_DECRYPTED_ACCOUNT', null)
    })

    return { password, giveAccess, mnemonicError }
  }
}
</script>
