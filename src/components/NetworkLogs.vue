<template>
  <v-list>
    <network-log
      v-for="network in networks"
      :key="network"
      :network="network"
      :callback="$props.callback(network)"
      :pending-message="$props.pendingMessage"
      :loading-message="$props.loadingMessage"
      :fail-message="$props.failMessage"
      :success-message="$props.successMessage"
      ref="logService"
      @success="successNetworks = [...successNetworks, $event]"
      :force-status="$props.status"
      :force-update="$props.forceUpdate"
    />
  </v-list>
</template>

<script lang="ts">
import { ref, type Ref, type PropType } from 'vue'

import { useLogService, type LogService } from './NetworkLog.vue'
import { watch } from 'vue'

export function useLogsService() {
  return ref() as Ref<LogService>
}

export default {
  name: 'NetworkLogs',
  props: {
    networks: { type: Array as PropType<string[]>, required: true },
    pendingMessage: String,
    loadingMessage: String,
    successMessage: String,
    failMessage: String,
    callback: {
      type: Function as PropType<(network: string) => (...args: any[]) => Promise<unknown>>,
      required: true
    },
    modelValue: Array as PropType<string[]>,
    status: String as PropType<'pending' | 'loading' | 'success' | 'fail'>,
    forceUpdate: Boolean
  },
  emits: {
    'update:model-value': (networks: string[]) => true || networks
  },
  setup(_, { expose, emit }) {
    const logService = useLogService()

    expose({ trigger })
    function trigger(...args: any[]) {
      return Promise.all(logService.value.map((log) => log.trigger(...args)))
    }

    const successNetworks = ref<string[]>([])
    watch(successNetworks, (networks) => {
      emit('update:model-value', networks)
    })

    return { logService, successNetworks }
  }
}
</script>
