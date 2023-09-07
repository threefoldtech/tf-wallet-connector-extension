<template>
  <v-select
    label="Networks to join"
    :items="selectableNetworks"
    :disabled="$props.disabled"
    :model-value="$props.modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :multiple="!$props.single"
    :return-object="false"
  >
    <template #item="{ item, props }">
      <v-list-item v-bind="props" class="py-2" :disabled="item.raw.disabled">
        <template #prepend>
          <v-checkbox-btn :model-value="$props.modelValue.includes(item.raw.value)" />
        </template>
        <template #append v-if="item.raw.disabled">
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
</template>

<script lang="ts">
import { computed } from 'vue'

import { capitalize } from '@/utils'
import type { PropType } from 'vue'

export default {
  name: 'NetworkField',
  props: {
    disabled: { type: Boolean, default: () => false },
    single: { type: Boolean, default: () => false },
    modelValue: { type: Array as PropType<string[]>, required: true },
    disabledNetworks: { type: Array as PropType<string[]>, default: () => [] }
  },
  emits: {
    'update:model-value': (networks: string[]) => true || networks
  },
  setup(props) {
    const selectableNetworks = computed(() => {
      return ['main', 'test', 'qa', 'dev'].map((network) => {
        return {
          title: capitalize(network + 'net'),
          value: network,
          disabled: props.disabledNetworks.includes(network)
        }
      })
    })

    return {
      selectableNetworks
    }
  }
}
</script>
