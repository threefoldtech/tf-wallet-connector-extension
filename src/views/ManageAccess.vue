<template>
  <ext-layout>
    <template #title>Manage websites access</template>

    <div>test</div>
  </ext-layout>
</template>

<script lang="ts">
import { onMounted } from 'vue'

import { sendMessageToContent } from '@/utils'

export default {
  name: 'ManageAccess',
  setup() {
    onMounted(async () => {
      const list = await sendMessageToContent('GET_AUTH_LIST')
      console.log({ list })
    })
  }
}
</script>
