<template>
  manage
  <!-- <read-ssh :account="account" /> -->
</template>

<script lang="ts">
import type { Account } from '@/types'
import type { PropType } from 'vue'

// import ReadSsh from './ReadSsh.vue'

export default {
  name: 'ManageSsh',
  //   components: { ReadSsh },
  props: {
    account: { type: Object as PropType<Account>, required: true }
  }
}
</script>
