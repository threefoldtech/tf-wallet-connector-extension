<template>
  <ext-layout
    :search="walletStore.accounts.length ? search : undefined"
    @update:search="search = $event"
    remove-back
  >
    <template #title>Accounts</template>

    <template v-if="walletStore.accounts.length > 0 && accounts.length > 0">
      <account-chip v-for="account in accounts" :key="account.mnemonic" :account="account" />
    </template>
    <div v-else class="d-flex justify-center align-center h-100 text-h6">
      {{
        walletStore.accounts.length > 0
          ? 'No account matches your search.'
          : 'No accounts added yet!'
      }}
    </div>
  </ext-layout>
</template>

<script lang="ts">
import { computed, ref } from 'vue'

import { useWalletStore } from '@/stores'

export default {
  name: 'AccountsList',
  setup() {
    const walletStore = useWalletStore()
    const search = ref('')

    const accounts = computed(() => {
      return walletStore.accounts.filter((account) => {
        return account.name.toLowerCase().includes(search.value.toLowerCase())
      })
    })

    return { search, walletStore, accounts }
  }
}
</script>
