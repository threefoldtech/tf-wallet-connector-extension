<template>
  <form
    @submit.prevent="
      () => {
        if (alreadyAcceptedTerms) {
          return joinNetworks()
        }
        ShowTermsDialog = true
        alreadyAcceptedTerms = true
      }
    "
  >
    <v-select
      label="Networks to join"
      :items="networkItems"
      :model-value="selectedNetworks"
      @update:model-value="
        ($event) => {
          selectedNetworks = $event
          if (joinNetworksLogs) {
            joinNetworksLogs = undefined
          }
        }
      "
      multiple
      :return-object="false"
    >
      <template #item="{ item, props }">
        <v-list-item v-bind="props" class="py-2" :disabled="joinedNetworks.has(item.value)">
          <template #prepend>
            <v-checkbox-btn :model-value="selectedNetworks.includes(item.value)" />
          </template>
          <template #append v-if="joinedNetworks.has(item.value)">
            <v-icon icon="mdi-check" color="green" />
          </template>
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <v-chip color="primary" size="small" class="rounded-sm mr-1 font-weight-bold">
          {{ item.title }}
        </v-chip>
      </template>
    </v-select>

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
      color="primary"
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

  <terms-dialog v-model="ShowTermsDialog" @accept="joinNetworks()" v-if="ShowTermsDialog" />
</template>

<script lang="ts">
import { onMounted, ref, watch, computed, type PropType } from 'vue'

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
    const ShowTermsDialog = ref(false)
    const alreadyAcceptedTerms = ref(false)
    const selectedNetworks = ref<string[]>([])
    const joinedNetworks = ref(new Set<string>())
    const joinNetworksLogs = ref<NetworkLogs[]>()

    onMounted(async () => (selectedNetworks.value = [await getNetwork()]))

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
        console.log({ selected, joined })

        emit('update:model-value', selected)
        if (selected.length === 0) return emit('update:valid', false)
        emit(
          'update:valid',
          selected.every((nw) => joined.has(nw))
        )
      },
      { immediate: true }
    )

    watch(
      joinNetworksLogs,
      (logs) => {
        emit('update:loading', logs?.some((item) => item.loading) || false)
      },
      { immediate: true }
    )

    return {
      ShowTermsDialog,
      alreadyAcceptedTerms,
      selectedNetworks,
      joinNetworks,
      joinedNetworks,
      networkItems,
      joinNetworksLogs
    }
  }
}
</script>
