<template>
  <v-card class="rounded-0">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
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
      />

      <v-menu transition="slide-y-transition" location="bottom right" v-if="!removeActions">
        <template v-slot:activator="{ props }">
          <v-tooltip text="Settings" :theme="theme.next">
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
          <v-list-item to="/create-account">
            <template #prepend>
              <v-icon icon="mdi-account-plus" />
            </template>
            <v-list-item-title>Create new account</v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item to="/export-accounts">
            <template #prepend>
              <v-icon icon="mdi-export" />
            </template>
            <v-list-item-title>Export all account</v-list-item-title>
          </v-list-item>

          <v-list-item to="/import-preaccount">
            <template #prepend>
              <v-icon icon="mdi-key-variant" />
            </template>
            <v-list-item-title>Import account from pre-existing seed</v-list-item-title>
          </v-list-item>

          <v-list-item to="/restore-accounts">
            <template #prepend>
              <v-icon icon="mdi-file-upload" />
            </template>
            <v-list-item-title>Restore account from backup JSON file</v-list-item-title>
          </v-list-item>

          <v-divider />

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
    </v-card-title>

    <v-divider />

    <v-card-text :style="{ overflowY: 'auto', maxHeight: '510px' }">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useVuetifyTheme } from '@/hooks'
import ThreefoldLogo from '../assets/threefold-logo.png'

export default {
  name: 'ExtLayout',
  props: {
    noLogo: Boolean,
    search: String,
    disableActions: Boolean,
    removeActions: Boolean
  },
  emits: {
    'update:search': (query: string) => true || query
  },
  setup() {
    const theme = useVuetifyTheme()

    return {
      ThreefoldLogo,

      theme
    }
  }
}
</script>
