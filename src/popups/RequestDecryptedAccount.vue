<template>
  <ext-layout remove-actions>
    <template #title>Request decrypted account</template>
    <p>Do you want to give `{{ $route.query.url || '' }}` access to your decrypted account?</p>

    <v-text-field label="Account password" type="password" v-model="password" />

    <v-btn type="submit" variant="tonal" block color="error" class="mt-1" @click="giveAccess">
      Give Access
    </v-btn>

    <div class="mt-2 d-flex justify-center">
      <v-btn variant="plain" @click="close"> Cancel </v-btn>
    </div>
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

    function close() {
      window.close()
    }

    function giveAccess() {
      const hashPassword = md5(password.value)
      const cryptr = new Cryptr(hashPassword, { pbkdf2Iterations: 10, saltLength: 10 })

      /* Assume it's valid for now */
      sendMessageToContent(
        'REQUEST_DECRYPTED_ACCOUNT',
        cryptr.decrypt(route.params.mnemonic as string)
      )

      close()
    }

    return { close, password, giveAccess }
  }
}
</script>
