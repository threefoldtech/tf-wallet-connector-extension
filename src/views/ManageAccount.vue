<template>
  <ext-layout>
    <template #title>Manage account</template>

    <account-chip :account="account" remove-actions />

    <div
      :style="{ height: '366px', marginRight: '-16px', paddingRight: '16px' }"
      class="overflow-y-auto"
    >
      <h3 class="mt-8 mb-2 text-display-1 font-weight-regular text-decoration-underline">
        Manage Account Public SSH key
      </h3>

      <v-tabs align-tabs="center" color="primary" v-model="currentTab">
        <v-tab>Manage</v-tab>
        <v-tab>Sync</v-tab>
        <v-tab>Read</v-tab>
      </v-tabs>
      <v-divider class="mb-4" />

      <manage-ssh :account="account" v-if="currentTab === 0" />
      <sync-ssh :account="account" v-if="currentTab === 1" />
      <read-ssh :account="account" v-else-if="currentTab === 2" />
    </div>

    <!-- <div v-if="currentTab === 0">

    </div> -->

    <!-- <network-field
      label="Select networks to sync ssh on"
      :networks="account.networks"
      v-model="networks"
    /> -->

    <!-- <ssh-field :account="account" /> -->
    <!-- <ssh-field
      no-password
      new-account
      :account="fakeAccount"
      :networks="networks"
      v-model:loading="sshLoading"
      v-model:public-ssh="fakeAccount.ssh"
      :disabled="loading"
    /> -->
  </ext-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useWalletStore } from '@/stores'
// import SshField from '@/components/SshField.vue'

import ManageSsh from '@/components/ManageSsh.vue'
import SyncSsh from '@/components/SyncSsh.vue'
import ReadSsh from '@/components/ReadSsh.vue'

export default {
  name: 'ManageAccount',
  components: { /* SshField */ ManageSsh, SyncSsh, ReadSsh },
  setup() {
    const walletStore = useWalletStore()
    const route = useRoute()
    const currentTab = ref(1)

    const account = walletStore.findAccount(route.params.mnemonic as string)

    return {
      account,
      currentTab
    }
  }
}
</script>
