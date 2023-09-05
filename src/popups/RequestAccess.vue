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
import { sendMessageToContent, storage } from '@/utils'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'RequestAccess',

  setup() {
    const accepting = ref(false)
    const denying = ref(false)
    const route = useRoute()

    async function getNewAuthList(accept: boolean) {
      const authList = await storage.authList
      authList[route.query.url as string] = accept
      return authList
    }

    async function accept() {
      accepting.value = true
      await storage.setAuthList(await getNewAuthList(true))
      await sendMessageToContent('RESPONSE_ACCESS', true)
      window.close()
    }

    window.addEventListener('beforeunload', async () => {
      if (accepting.value) return
      await storage.setAuthList(await getNewAuthList(false))
      await sendMessageToContent('RESPONSE_ACCESS', false)
    })

    return { accept, accepting, denying }
  }
}
</script>
