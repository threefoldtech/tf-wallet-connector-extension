<template>
  <ext-layout
    :search="walletStore.accounts.length ? search : undefined"
    @update:search="search = $event"
  >
    <template #title>Accounts</template>

    <template v-if="walletStore.accounts.length > 0 && accounts.length > 0">
      <account-chip v-for="account in accounts" :key="account.mnemonic" :account="account" />
    </template>
    <v-card type="info" variant="tonal" v-else>
      <template v-if="walletStore.accounts.length > 0">
        <v-card-text>No account matches your search.</v-card-text>
      </template>
      <v-card-text v-else>Please add an account.</v-card-text>
    </v-card>
  </ext-layout>
</template>

<script lang="ts">
import { computed, ref } from 'vue'

import { useWalletStore } from '@/stores'

import AccountChip from '@/components/AccountChip.vue'

export default {
  name: 'AccountsList',
  components: { AccountChip },
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
