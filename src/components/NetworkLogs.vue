<template>NetworkLogs</template>

<script lang="ts">
export enum NetworkLogsStatus {
  Pending,
  Loading,
  Success,
  Failed
}

export interface CreateNetworkLogsOptions {
  status: NetworkLogsStatus
  promise: Promise<unknown>
}

export function createNetworkLogs(options: CreateNetworkLogsOptions) {}

export default {
  name: 'NetworkLogs'
}
</script>
