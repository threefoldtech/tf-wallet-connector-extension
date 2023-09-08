<template>
  <v-list-item>
    <template #prepend>
      <div class="mr-2 mb-4">
        <v-progress-circular
          indeterminate
          size="15"
          width="2"
          color="primary"
          v-if="status === 'loading'"
        />
        <v-icon icon="mdi-check" color="green" v-else-if="status === 'success'" />
        <v-icon icon="mdi-close" color="red" v-else-if="status === 'fail'" />
        <v-icon icon="mdi-sync" color="grey" v-else />
      </div>
    </template>
    <v-list-item-title class="text-capitalize">{{ network }}net</v-list-item-title>
    <v-list-item-subtitle
      :class="{
        'text-red': status === 'fail',
        'text-green': status === 'success'
      }"
    >
      {{ message }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script lang="ts">
import { ref, computed, type PropType, type Ref } from 'vue'

export interface LogService {
  trigger(...args: any[]): Promise<void>
}

export function useLogService() {
  return ref([]) as Ref<LogService[]>
}

export default {
  name: 'NetworkLog',
  props: {
    pendingMessage: { type: String, default: () => 'Pending to start.' },
    loadingMessage: { type: String, default: () => 'Loading...' },
    successMessage: { type: String, default: () => 'Succeeded.' },
    failMessage: { type: String, default: () => 'Failed.' },
    network: { type: String, required: true },
    callback: {
      type: Function as PropType<(...args: any[]) => Promise<unknown>>,
      required: true
    },
    forceStatus: String as PropType<'pending' | 'loading' | 'success' | 'fail'>,
    forceUpdate: { type: Boolean, default: () => false }
  },
  emits: {
    success: (network: string) => true || network
  },
  setup(props, { expose, emit }) {
    const currentStatus = ref<'pending' | 'loading' | 'success' | 'fail'>('pending')
    const status = computed(() => props.forceStatus || currentStatus.value)

    const message = computed(() => {
      if (status.value === 'loading') return props.loadingMessage
      if (status.value === 'fail') return props.failMessage
      if (status.value === 'success') return props.successMessage
      return props.pendingMessage
    })

    expose({ trigger })
    async function trigger(...args: any[]) {
      if (status.value === 'success' && !props.forceUpdate) return

      currentStatus.value = 'loading'

      return props
        .callback(...args)
        .then(() => {
          currentStatus.value = 'success'
          emit('success', props.network)
        })
        .catch(() => (currentStatus.value = 'fail'))
    }

    return { status, message }
  }
}
</script>
