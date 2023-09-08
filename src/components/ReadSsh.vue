<template>
  <div class="d-flex align-center">
    <network-field
      :networks="account.networks"
      single
      label="Network to read from"
      v-model="networkToReadFrom"
      hide-details
      :disabled="disabled || reading"
    />

    <v-tooltip text="Load" :theme="theme.next" v-if="!strict">
      <template #activator="{ props }">
        <v-btn
          :disabled="disabled"
          :theme="theme.current"
          icon="mdi-reload"
          variant="tonal"
          color="primary"
          class="ml-2"
          @click="read"
          :loading="reading"
          v-bind="props"
        />
      </template>
    </v-tooltip>
  </div>

  <copy-field :data="reading ? '' : sshKey" #="{ copyInputProps }">
    <v-textarea
      :disabled="strict && (!sshKey || reading)"
      class="mt-4"
      no-resize
      label="Public SSH Key"
      readonly
      :model-value="reading ? '' : sshKey"
      :loading="reading"
      v-bind="copyInputProps"
    />
  </copy-field>
</template>

<script lang="ts">
import { ref } from 'vue'

import { useVuetifyTheme } from '@/hooks'

import { getBestNetwork, loadGrid, readSSH } from '@/utils'
import type { PropType } from 'vue'
import type { Account } from '@/types'
import { watch } from 'vue'

export default {
  name: 'ReadSsh',
  props: {
    account: { type: Object as PropType<Account>, required: true },
    strict: { type: Boolean, default: () => false },
    modelValue: String,
    valid: Boolean,
    disabled: { type: Boolean, default: () => false },
    ssh: String
  },
  emits: {
    'update:model-value': (network: string) => true || network,
    'update:valid': (valid: boolean) => true || valid,
    'update:ssh': (ssh: string) => true || ssh
  },
  setup(props, { emit }) {
    const theme = useVuetifyTheme()
    const networkToReadFrom = ref<string>(
      props.strict ? (undefined as any) : getBestNetwork(props.account.networks)
    )
    const sshKey = ref('')
    const reading = ref(false)
    async function read() {
      reading.value = true
      const grid = await loadGrid(props.account.mnemonic, networkToReadFrom.value)
      sshKey.value = await readSSH(grid)
      await grid.disconnect()
      emit('update:ssh', sshKey.value)
      reading.value = false
    }

    if (props.strict) {
      watch(networkToReadFrom, async (network) => {
        emit('update:model-value', network)
        await read()
      })

      watch([networkToReadFrom, reading], ([network, reading]) => {
        emit('update:valid', !!network && !reading)
      })
    }

    return { theme, networkToReadFrom, sshKey, reading, read }
  }
}
</script>
