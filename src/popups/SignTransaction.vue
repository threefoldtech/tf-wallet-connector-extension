<template>
  <ext-layout remove-back remove-actions>
    <template #title>Sign Transaction</template>

    <div class="d-flex flex-column justify-center align-center h-100">
      <v-progress-circular indeterminate />
      <p class="font-weight-bold mt-4 mb-12">Signing your transaction</p>
    </div>
  </ext-layout>
</template>

<script lang="ts">
import { KeypairType, sendMessageToContent, sign } from '@/utils'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SignTransaction',
  setup() {
    const route = useRoute()

    onMounted(signTransaction)
    async function signTransaction() {
      const content = route.params.content as string
      const mnemonic = route.params.mnemonic as string
      const keypair = route.params.keypair as KeypairType

      try {
        const signedTransaction = await sign({ content, mnemonic, keypairType: keypair })
        await sendMessageToContent('SIGN_TRANSACTION', signedTransaction)
      } catch {
        await sendMessageToContent('SIGN_TRANSACTION', null)
      }

      window.close()
    }
  }
}
</script>
