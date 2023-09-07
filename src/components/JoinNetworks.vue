<template>
  <form
    @submit.prevent="
      () => {
        if (alreadyAcceptedTerms) {
          return joinNetworks()
        }
        ShowTermsDialog = true
      }
    "
  >
    <network-field
      :disabled="loadingLogs"
      :disabledNetworks="Array.from(joinedNetworks)"
      :model-value="selectedNetworks"
      @update:model-value="
        ($event) => {
          selectedNetworks = $event
          $router.push($route.path + `?networks=` + selectedNetworks.join(','))
          if (joinNetworksLogs) {
            joinNetworksLogs = undefined
          }
        }
      "
    />

    <v-list :lines="false" v-if="joinNetworksLogs?.length">
      <v-list-item v-for="networkLogs in joinNetworksLogs" :key="networkLogs.network">
        <template #prepend>
          <div class="mr-2 mb-4">
            <v-progress-circular
              indeterminate
              size="15"
              width="2"
              color="primary"
              v-if="networkLogs.loading"
            />
            <v-icon icon="mdi-check" color="green" v-else-if="networkLogs.success" />
            <v-icon icon="mdi-close" color="red" v-else />
          </div>
        </template>
        <v-list-item-title class="text-capitalize">{{ networkLogs.network }}net</v-list-item-title>
        <v-list-item-subtitle
          :class="{
            'text-red': !networkLogs.loading && !networkLogs.success,
            'text-green': !networkLogs.loading && networkLogs.success
          }"
        >
          {{ networkLogs.message }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-btn
      type="submit"
      color="secondary"
      variant="tonal"
      block
      size="large"
      :disabled="
        selectedNetworks.length === 0 ||
        selectedNetworks.every((network) => joinedNetworks.has(network)) ||
        joinNetworksLogs?.some((log) => log.loading)
      "
    >
      Join select networks
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

import { getNetwork, checkAndCreateTwin } from '@/utils'

interface NetworkLogs {
  network: string
  loading: boolean
  success: boolean
  message: string
}

export default {
  name: 'JoinNetworks',
  props: {
    mnemonic: {
      type: String,
      required: true
    },
    loading: Boolean,
    valid: Boolean,
    modelValue: Array as PropType<String[]>
  },
  emits: {
    'update:loading': (loading: boolean) => true || loading,
    'update:valid': (valid: boolean) => true || valid,
    'update:model-value': (value: string[]) => true || value
  },
  setup(props, { emit }) {
    const route = useRoute()

    const ShowTermsDialog = ref(false)
    const alreadyAcceptedTerms = ref(false)
    const selectedNetworks = ref<string[]>([])
    const joinedNetworks = ref(new Set<string>())
    const joinNetworksLogs = ref<NetworkLogs[]>()

    onMounted(async () => {
      const networks = ((route.query.networks as string)?.trim() || '')
        .split(',')
        .filter((x) => !!x)
      selectedNetworks.value = networks.length ? networks : [await getNetwork()]
    })

    async function joinNetworks() {
      joinNetworksLogs.value = selectedNetworks.value.map((network) => {
        return {
          network,
          loading: !joinedNetworks.value.has(network),
          success: joinedNetworks.value.has(network),
          message: joinedNetworks.value.has(network)
            ? 'Successfully joined network.'
            : 'Trying to join network...'
        }
      })

      for (let i = 0; i < joinNetworksLogs.value.length; i++) {
        const logs = joinNetworksLogs.value[i]
        if (logs.success) continue

        checkAndCreateTwin(props.mnemonic, logs.network).then((done) => {
          if (done) {
            joinNetworksLogs.value![i].success = true
            joinNetworksLogs.value![i].message = 'Successfully joined network.'
            joinedNetworks.value = new Set([...joinedNetworks.value, logs.network])
          } else {
            joinNetworksLogs.value![i].message = 'Failed to join network after 3 attempts.'
          }
          joinNetworksLogs.value![i].loading = false
          // force update logs
          joinNetworksLogs.value = joinNetworksLogs.value ? [...joinNetworksLogs.value] : undefined
        })
      }
    }

    const networkItems = computed(() => {
      return ['main', 'test', 'qa', 'dev'].map((network) => {
        return {
          title: network[0].toUpperCase() + network.slice(1) + 'net',
          value: network,
          isDisabled: joinedNetworks.value.has(network)
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
          selected.every((nw) => joined.has(nw))
        )
      },
      { immediate: true }
    )

    const loadingLogs = computed(() => {
      const logs = joinNetworksLogs.value
      return logs?.some((item) => item.loading) || false
    })

    watch(loadingLogs, (loading) => emit('update:loading', loading), { immediate: true })

    return {
      ShowTermsDialog,
      alreadyAcceptedTerms,
      selectedNetworks,
      joinNetworks,
      joinedNetworks,
      networkItems,
      joinNetworksLogs,
      loadingLogs
    }
  }
}
</script>
