<template>
  <v-card variant="tonal" class="mb-4">
    <v-card-text class="d-flex justify-space-between">
      <div class="d-flex flex-column justify-center">
        <form
          class="d-block position-relative"
          @submit.prevent="renameAccount"
          v-if="rename"
          :style="{ top: '-2px' }"
        >
          <v-text-field
            spellcheck="false"
            variant="plain"
            v-model="name"
            autofocus
            :style="{ marginTop: '-13px', marginBottom: '-20px' }"
            v-model:focused="rename"
          />
        </form>
        <h6 class="text-body-1" v-else>{{ account.name }}</h6>
        <p
          :style="{ fontSize: '0.7rem', top: rename ? '-9px' : 0 }"
          class="text-medium-emphasis position-relative"
        >
          {{ account.address }}
        </p>
      </div>
      <div class="d-flex" :class="{ 'align-center': !removeActions, 'align-end': removeActions }">
        <div>
          <v-btn
            v-if="!removeActions"
            icon
            size="x-small"
            variant="flat"
            class="d-block"
            @click="walletStore.toggleVisibility(account.mnemonic)"
          >
            <v-tooltip text="Toggle Visibility" :theme="theme.next">
              <template #activator="{ props }">
                <v-icon
                  :theme="theme.current"
                  :icon="account.visible ? 'mdi-eye' : 'mdi-eye-off-outline'"
                  :color="account.visible ? undefined : 'error'"
                  v-bind="props"
                />
              </template>
            </v-tooltip>
          </v-btn>
          <copy-field :data="account.address" #="{ copyFieldProps }">
            <v-tooltip text="Copy Address">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  :theme="theme.current"
                  icon="mdi-content-copy"
                  size="x-small"
                  variant="flat"
                  v-bind="$combineProps(copyFieldProps, tooltipProps)"
                />
              </template>
            </v-tooltip>
          </copy-field>
        </div>
        <v-divider vertical class="mx-2" v-if="!removeActions" />
        <v-menu v-if="!removeActions">
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" size="small" variant="flat" v-bind="props" />
          </template>

          <v-list transition="scale-transition" location="bottom right">
            <v-list-item @click="enableRename">
              <template #prepend>
                <v-icon icon="mdi-rename-outline" />
              </template>
              <v-list-item-title>Rename</v-list-item-title>
            </v-list-item>

            <v-list-item :to="'/manage-account/' + account.mnemonic">
              <template #prepend>
                <v-icon icon="mdi-cog" />
              </template>
              <v-list-item-title>Manage Account</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item :to="'/export-account/' + account.mnemonic">
              <template #prepend>
                <v-icon color="error" icon="mdi-export" />
              </template>
              <v-list-item-title>Export Account</v-list-item-title>
            </v-list-item>

            <v-list-item :to="'/forget-account/' + account.mnemonic">
              <template #prepend>
                <v-icon color="error" icon="mdi-delete" />
              </template>
              <v-list-item-title>Forget Account</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-item>
      <div class="d-flex justify-space-between align-start mt-1">
        <div>
          <v-chip
            v-for="network in networks"
            :key="network"
            :color="isActiveNetwork(network) ? 'primary' : undefined"
            size="small"
            class="rounded-sm mr-1 mb-1 font-weight-bold"
          >
            <span
              class="text-capitalize"
              :class="{
                'text-decoration-line-through': !isActiveNetwork(network)
              }"
            >
              {{ network }}net
            </span>
          </v-chip>
        </div>
        <div>
          <v-chip color="error" size="small" class="rounded-sm mr-1 font-weight-bold">
            {{ account.keypairType }}
          </v-chip>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { type PropType, ref } from 'vue'

import type { Account } from '@/types'
import { useVuetifyTheme } from '@/hooks'
import { useWalletStore } from '@/stores'
import { computed } from 'vue'

export default {
  name: 'AccountChip',
  props: {
    account: {
      required: true,
      type: Object as PropType<Account>
    },
    removeActions: Boolean,
    selectedNetworks: { type: [Array, null] as PropType<string[] | null>, required: false }
  },
  setup(props) {
    const showCopyNotification = ref(false)
    const theme = useVuetifyTheme()
    const walletStore = useWalletStore()

    const rename = ref(false)
    const name = ref('')
    function enableRename() {
      name.value = props.account.name
      rename.value = true
    }
    function renameAccount() {
      rename.value = false
      if (name.value.length === 0 || name.value === props.account.name) return
      walletStore.renameAccount(props.account.mnemonic, name.value)
    }

    const networks = computed(() => props.account.networks)

    function isActiveNetwork(network: string): boolean {
      return props.selectedNetworks?.includes(network) ?? true
    }

    return {
      showCopyNotification,
      theme,
      walletStore,
      rename,
      name,
      enableRename,
      renameAccount,
      networks,
      isActiveNetwork
    }
  }
}
</script>
