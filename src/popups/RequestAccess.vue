<template>
  <ext-layout remove-actions>
    <template #title>Request access</template>
    <p>Do you want to give `{{ $route.query.url || '' }}` access to sign transactions?</p>
    <v-btn
      type="submit"
      variant="tonal"
      block
      color="error"
      class="mt-1"
      @click="accept(+$route.query.tabId!)"
      :loading="accepting"
      :disabled="denying"
    >
      Give Access
    </v-btn>
    <div class="mt-2 d-flex justify-center">
      <v-btn
        variant="plain"
        @click="deny(+$route.query.tabId!)"
        :loading="denying"
        :disabled="accepting"
      >
        Cancel
      </v-btn>
    </div>
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

    async function accept(tabId?: number) {
      accepting.value = true
      await sendMessageToContent('RESPONSE_ACCESS', true, tabId)
      window.close()
    }

    async function deny(tabId?: number) {
      denying.value = true
      await sendMessageToContent('RESPONSE_ACCESS', false, tabId)
      window.close()
    }

    return { accept, deny, accepting, denying }
  }
}
</script>
