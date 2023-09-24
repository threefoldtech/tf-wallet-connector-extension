<template>
  <div class="mt-4">
    <join-networks
      :mnemonic="$props.account.mnemonic"
      :selectable-networks="
        ['dev', 'test', 'qa', 'main'].filter((nw) => !initNetworks.includes(nw as any))
      "
      v-model="networks"
      v-model:valid="networkValid"
      v-model:loading="networkLoading"
    />
  </div>
</template>

<script lang="ts">
import type { Account } from '@/types'
import { ref, watch, type PropType } from 'vue'

import { useWalletStore } from '@/stores'

import JoinNetworks from '@/components/JoinNetworks.vue'

export default {
  name: 'ManageNetworks',
  components: { JoinNetworks },
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true
    },
    loading: Boolean
  },
  emits: {
    'update:loading': (loading: boolean) => true || loading
  },
  setup(props, { emit }) {
    const walletStore = useWalletStore()
    const initNetworks = props.account.networks
    const networks = ref<string[]>([])
    const networkValid = ref(false)
    const networkLoading = ref(false)
    const loading = ref(false)

    watch([networks, networkValid], async ([networks, valid]) => {
      if (networks.length > 0 && valid) {
        loading.value = true
        await walletStore.updateNetworks(props.account.address, networks)
        loading.value = false
      }
    })

    watch(
      [networkLoading, loading],
      ([l1, l2]) => {
        emit('update:loading', l1 || l2)
      },
      { immediate: true }
    )

    return { initNetworks, networks, networkValid, networkLoading }
  }
}
</script>
