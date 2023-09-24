<template>
  <read-ssh
    strict
    :account="account"
    :model-value="network"
    @update:model-value="
      ($event) => {
        network = $event
        networks = []
        syncedNetworks = []
      }
    "
    v-model:valid="networkValid"
    :disabled="syncing"
    v-model:ssh="ssh"
    @update:loading="$emit('update:loading', $event)"
  />

  <network-field
    label="Networks to sync on"
    :disabled="syncing || !networkValid"
    :networks="selectableNetworks"
    :disabled-networks="syncedNetworks"
    v-model="networks"
  />

  <network-logs
    :networks="networks"
    :callback="syncCallback"
    pending-message="Pending to sync public ssh key."
    loading-message="Syncing public ssh key."
    fail-message="Failed to sync public ssh key."
    success-message="Successfully sync public ssh key."
    ref="logsService"
    v-model="syncedNetworks"
  />

  <v-btn
    :class="{ 'mt-4': networks.length > 0 }"
    variant="tonal"
    color="primary"
    size="large"
    @click="sync"
    :disabled="
      !networkValid ||
      networks.length === 0 ||
      networks.every((network) => syncedNetworks.includes(network))
    "
    block
    :loading="syncing"
  >
    Sync
  </v-btn>
</template>

<script lang="ts">
import { ref, type PropType } from 'vue'

import type { Account } from '@/types'

import ReadSsh from './ReadSsh.vue'
import { computed } from 'vue'
import { loadGrid, storeSSH } from '@/utils'
import { watch } from 'vue'

import { useLogsService } from './NetworkLogs.vue'

export default {
  name: 'SyncSsh',
  components: { ReadSsh },
  props: {
    account: { type: Object as PropType<Account>, required: true },
    loading: Boolean
  },
  emits: {
    'update:loading': (loading: boolean) => true || loading
  },
  setup(props, { emit }) {
    const network = ref<string>()
    const networkValid = ref(false)
    const ssh = ref('')
    const logsService = useLogsService()
    const syncedNetworks = ref<string[]>([])

    const selectableNetworks = computed(() => {
      return props.account.networks.filter((nw) => nw !== network.value)
    })
    const networks = ref<string[]>([])

    const networksLogs = ref()
    watch(networks, (networks) => {
      networksLogs.value = networks
    })

    const syncing = ref(false)
    async function sync() {
      syncing.value = true
      await logsService.value.trigger(ssh.value)
      syncing.value = false
    }

    function syncCallback(network: string) {
      return (ssh: string) => {
        return loadGrid(props.account.mnemonic, network).then((grid) => storeSSH(grid, ssh))
      }
    }

    watch(syncing, (l) => emit('update:loading', l), { immediate: true })

    return {
      network,
      networkValid,
      networks,
      selectableNetworks,
      syncing,
      sync,
      syncCallback,
      logsService,
      ssh,
      syncedNetworks
    }
  }
}
</script>
