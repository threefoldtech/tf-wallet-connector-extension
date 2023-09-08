<template>
  <network-field
    :networks="account.networks"
    label="Networks to update public ssh on"
    v-model="selectedNetworks"
    :disabled="loading"
  />

  <ssh-field
    :account="account"
    no-password
    :networks="selectedNetworks"
    v-model:loading="loading"
  />
</template>

<script lang="ts">
import type { Account } from '@/types'
import type { PropType } from 'vue'

import SshField from './SshField.vue'
import { ref } from 'vue'

export default {
  name: 'ManageSsh',
  components: { SshField },
  props: {
    account: { type: Object as PropType<Account>, required: true }
  },
  setup() {
    const selectedNetworks = ref<string[]>([])
    const loading = ref(false)

    return { selectedNetworks, loading }
  }
}
</script>
