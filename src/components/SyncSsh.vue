<template>
  <read-ssh
    strict
    :account="account"
    :model-value="network"
    @update:model-value="
      ($event) => {
        network = $event
        networks = []
      }
    "
    v-model:valid="networkValid"
    :disabled="syncing"
  />

  <network-field
    label="Networks to sync on"
    :disabled="syncing || !networkValid"
    :networks="selectableNetworks"
    v-model="networks"
  />

  <v-btn
    variant="tonal"
    color="primary"
    size="large"
    @click="sync"
    :disabled="!networkValid || networks.length === 0"
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
import { loadGrid, readSSH, storeSSH } from '@/utils'
import { watch } from 'vue'

export default {
  name: 'SyncSsh',
  components: { ReadSsh },
  props: {
    account: { type: Object as PropType<Account>, required: true }
  },
  setup(props) {
    const network = ref<string>()
    const networkValid = ref(false)

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
      const grid = await loadGrid(props.account.mnemonic, network.value)
      const ssh = await readSSH(grid)

      await Promise.all(
        networks.value.map((network) =>
          loadGrid(props.account.mnemonic, network).then((grid) => storeSSH(grid, ssh))
        )
      )

      syncing.value = false
    }

    return { network, networkValid, networks, selectableNetworks, syncing, sync }
  }
}
</script>
