<template>
  <form
    @submit.prevent="
      () => {
        if (alreadyAcceptedTerms || $props.checkOnly) {
          return joinNetworks()
        }
        ShowTermsDialog = true
      }
    "
  >
    <network-field
      :networks="$props.selectableNetworks"
      :disabled="disabled || joining"
      :disabledNetworks="Array.from(joinedNetworks)"
      :model-value="selectedNetworks"
      @update:model-value="
        ($event) => {
          selectedNetworks = $event
          $router.push($route.path + `?networks=` + selectedNetworks.join(','))
        }
      "
    />

    <!-- prettier-ignore -->
    <network-logs
      :networks="selectedNetworks"
      :callback="joinNetwork"
      v-model="joinedNetworks"
      :pending-message="$props.checkOnly ? 'Pending to check if the network is joined.' : 'Pending to join network.'"
      :loading-message="$props.checkOnly ? 'Checking if the network is joined...' : 'Trying to join network...'"
      :success-message="$props.checkOnly ? 'Network is already joined.' : 'Successfully joined network.'"
      :fail-message="$props.checkOnly ? 'network is not yet joined.' : 'Failed to join network after 3 attempts.'"
      ref="logsService"
    />

    <v-btn
      type="submit"
      color="secondary"
      variant="tonal"
      block
      size="large"
      :disabled="
        disabled ||
        selectedNetworks.length === 0 ||
        selectedNetworks.every((network) => joinedNetworks.includes(network)) ||
        joining
      "
    >
      {{ $props.checkOnly ? 'Check selected networks' : 'Join selected networks' }}
    </v-btn>
  </form>

  <terms-dialog
    v-model="ShowTermsDialog"
    @accept="
      () => {
        alreadyAcceptedTerms = true
        joinNetworks()
      }
    "
    v-if="ShowTermsDialog"
  />
</template>

<script lang="ts">
import { onMounted, ref, watch, computed, type PropType } from 'vue'
import { useRoute } from 'vue-router'

import { checkAndCreateTwin, joinedNetwork, getBestNetwork } from '@/utils'

import { useLogsService } from './NetworkLogs.vue'

export default {
  name: 'JoinNetworks',
  props: {
    mnemonic: {
      type: String,
      required: true
    },
    loading: Boolean,
    valid: Boolean,
    modelValue: Array as PropType<String[]>,
    disabled: { type: Boolean, default: () => false },
    checkOnly: { type: Boolean, default: () => false },
    selectableNetworks: {
      type: Array as PropType<string[]>,
      default: () => ['main', 'test', 'qa', 'dev']
    }
  },
  emits: {
    'update:loading': (loading: boolean) => true || loading,
    'update:valid': (valid: boolean) => true || valid,
    'update:model-value': (value: string[]) => true || value
  },
  setup(props, { emit }) {
    const route = useRoute()
    const logsService = useLogsService()

    const ShowTermsDialog = ref(false)
    const alreadyAcceptedTerms = ref(false)
    const selectedNetworks = ref<string[]>([])
    const joinedNetworks = ref<string[]>([])

    onMounted(async () => {
      const networks = ((route.query.networks as string)?.trim() || '')
        .split(',')
        .filter((x) => !!x)
      selectedNetworks.value = networks.length
        ? networks
        : [getBestNetwork(props.selectableNetworks)]
    })

    function joinNetwork(network: string) {
      return () => {
        if (props.checkOnly) {
          return joinedNetwork(props.mnemonic, network).then((res) => {
            if (!res) throw new Error()
          })
        }
        return checkAndCreateTwin(props.mnemonic, network).then((res) => {
          if (!res) throw new Error()
        })
      }
    }

    const networkItems = computed(() => {
      return props.selectableNetworks.map((network) => {
        return {
          title: network[0].toUpperCase() + network.slice(1) + 'net',
          value: network,
          isDisabled: joinedNetworks.value.includes(network)
        }
      })
    })

    watch(
      [selectedNetworks, joinedNetworks],
      ([selected, joined]) => {
        emit('update:model-value', selected)
        if (selected.length === 0) return emit('update:valid', false)
        emit(
          'update:valid',
          selected.every((nw) => joined.includes(nw))
        )
      },
      { immediate: true }
    )

    const joining = ref(false)
    async function joinNetworks() {
      joining.value = true
      await logsService.value.trigger()
      joining.value = false
    }

    watch(joining, (loading) => emit('update:loading', loading), { immediate: true })

    return {
      logsService,
      ShowTermsDialog,
      alreadyAcceptedTerms,
      selectedNetworks,
      joinNetwork,
      joinedNetworks,
      networkItems,
      joinNetworks,
      joining
    }
  }
}
</script>
