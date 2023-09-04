<template>
  <ext-layout remove-back remove-actions>
    <template #title>Request access</template>
    <p>Do you want to give `{{ $route.query.url || '' }}` access to sign transactions?</p>
    <v-btn
      type="submit"
      variant="tonal"
      block
      color="error"
      class="mt-1"
      @click="accept()"
      :loading="accepting"
      :disabled="denying"
    >
      Give Access
    </v-btn>
  </ext-layout>
</template>

<script lang="ts">
import { sendMessageToContent } from '@/utils'
import { ref } from 'vue'

export default {
  name: 'RequestAccess',

  setup() {
    const accepting = ref(false)
    const denying = ref(false)

    async function accept() {
      accepting.value = true
      await sendMessageToContent('RESPONSE_ACCESS', true)
      window.close()
    }

    window.addEventListener('beforeunload', async () => {
      if (accepting.value) return
      await sendMessageToContent('RESPONSE_ACCESS', false)
    })

    return { accept, accepting, denying }
  }
}
</script>
