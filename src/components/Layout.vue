<template>
  <v-card class="rounded-0">
    <v-card-title class="d-flex align-center justify-space-between" :style="{ height: '64px' }">
      <div class="d-flex align-center">
        <v-tooltip text="Back" :theme="theme.next">
          <template #activator="{ props }">
            <v-btn
              :theme="theme.current"
              @click="$router.push('/')"
              icon="mdi-arrow-left"
              variant="plain"
              class="mr-2"
              v-bind="props"
              v-if="!removeBack"
            />
          </template>
        </v-tooltip>
        <img
          :style="{ filter: theme.imageLightenFilter }"
          :src="ThreefoldLogo"
          alt="logo"
          width="18"
          class="mr-3"
          v-if="!noLogo"
        />
        <slot name="title"></slot>
      </div>
      <v-text-field
        v-if="typeof search === 'string'"
        variant="underlined"
        class="mx-4"
        placeholder="Find an account..."
        autofocus
        clearable
        prepend-inner-icon="mdi-account"
        :model-value="$props.search"
        @update:model-value="$emit('update:search', $event)"
        @click:clear="$emit('update:search', '')"
        hide-details
        :style="{ marginTop: '-20px' }"
      />

      <div>
        <v-menu transition="slide-y-transition" location="bottom right" v-if="!removeActions">
          <template v-slot:activator="{ props }">
            <v-tooltip text="Account" :theme="theme.next">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  :disabled="disableActions"
                  :theme="theme.current"
                  icon="mdi-account"
                  variant="flat"
                  v-bind="$combineProps(props, tooltipProps)"
                />
              </template>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item @click="createNewAccount">
              <template #prepend>
                <v-icon icon="mdi-account-plus" />
              </template>
              <v-list-item-title>Create new account</v-list-item-title>
            </v-list-item>

            <v-list-item to="/import-preaccount">
              <template #prepend>
                <v-icon icon="mdi-key-variant" />
              </template>
              <v-list-item-title>Import account from pre-existing seed</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item to="/export-accounts">
              <template #prepend>
                <v-icon icon="mdi-export" />
              </template>
              <v-list-item-title>Export all account</v-list-item-title>
            </v-list-item>

            <v-list-item @click="openRestoreAccounts">
              <template #prepend>
                <v-icon icon="mdi-file-upload" />
              </template>
              <v-list-item-title>Restore account from backup JSON file</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu transition="slide-y-transition" location="bottom right" v-if="!removeActions">
          <template v-slot:activator="{ props }">
            <v-tooltip text="Setting" :theme="theme.next">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  :disabled="disableActions"
                  :theme="theme.current"
                  icon="mdi-cog"
                  variant="flat"
                  v-bind="$combineProps(props, tooltipProps)"
                />
              </template>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item to="/manage-access">
              <template #prepend>
                <v-icon icon="mdi-security" />
              </template>
              <v-list-item-title>Manage websites access</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click="theme.toggle">
              <template #prepend>
                <v-icon :icon="theme.icon" />
              </template>
              <v-list-item-title>Switch to {{ theme.next }} mode</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text :style="{ overflowY: 'auto', height: '535px' }">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useVuetifyTheme } from '@/hooks'
import ThreefoldLogo from '../assets/threefold-logo.png'

declare const chrome: any

import { getTabId } from '@/utils'

export default {
  name: 'ExtLayout',
  props: {
    noLogo: Boolean,
    search: String,
    disableActions: Boolean,
    removeActions: Boolean,
    removeBack: Boolean
  },
  emits: {
    'update:search': (query: string) => true || query
  },
  setup() {
    const theme = useVuetifyTheme()

    async function openRestoreAccounts() {
      const tabId = await getTabId()
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html') + '#/restore-accounts?tabId=' + tabId,
        height: 600,
        width: 535,
        top: 50,
        left: 50,
        focused: true,
        type: 'popup'
      })
    }

    function createNewAccount() {
      const tabId = getTabId()
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html') + '#/create-account?tabId=' + tabId,
        height: 600,
        width: 535,
        top: 50,
        left: 50,
        focused: true,
        type: 'popup'
      })
    }

    return {
      ThreefoldLogo,
      openRestoreAccounts,
      theme,
      createNewAccount
    }
  }
}
</script>
