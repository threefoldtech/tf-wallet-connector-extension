<template>
  <network-field
    :networks="account.networks"
    label="Networks to update public ssh on"
    v-model="selectedNetworks"
    :disabled="sshLoading"
  />

  <ssh-field
    :account="account"
    no-password
    :networks="selectedNetworks"
    :disabled="selectedNetworks.length === 0"
    v-model:loading="sshLoading"
  />
</template>

<script lang="ts">
import type { Account } from '@/types'
import { ref, watch, type PropType } from 'vue'

import SshField from './SshField.vue'

export default {
  name: 'ManageSsh',
  components: { SshField },
  props: {
    account: { type: Object as PropType<Account>, required: true },
    loading: Boolean
  },
  emits: {
    'update:loading': (loading: boolean) => true || loading
  },
  setup(_, { emit }) {
    const selectedNetworks = ref<string[]>([])
    const sshLoading = ref(false)

    watch(sshLoading, (l) => emit('update:loading', l), { immediate: true })

    return { selectedNetworks, sshLoading }
  }
}
</script>
