<template>
  <v-card variant="tonal" class="mb-4">
    <v-card-text class="d-flex justify-space-between">
      <div class="d-flex flex-column justify-center">
        <h6 class="text-sm-body-1">{{ account.name }}</h6>
        <p :style="{ fontSize: '0.7rem' }" class="text-medium-emphasis">
          {{ account.address }}
        </p>
      </div>
      <div class="d-flex align-center">
        <div>
          <v-btn icon size="x-small" variant="flat" class="d-block">
            <v-icon
              :icon="account.visible ? 'mdi-eye' : 'mdi-eye-off-outline'"
              :color="account.visible ? undefined : 'error'"
            />
          </v-btn>
          <v-snackbar timeout="1500" :theme="theme.next" variant="tonal">
            <p>Copied</p>
            <template #activator="{ props }">
              <v-tooltip text="Copy Address">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    :theme="theme.current"
                    icon="mdi-content-copy"
                    size="x-small"
                    variant="flat"
                    @click="$copy(account.address)"
                    v-bind="$combineProps(props, tooltipProps)"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-snackbar>
        </div>
        <v-divider vertical class="mx-2" />
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" size="small" variant="flat" v-bind="props" />
          </template>

          <v-list transition="scale-transition" location="bottom right">
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-rename-outline" />
              </template>
              <v-list-item-title>Rename</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item to="/export">
              <template #prepend>
                <v-icon color="error" icon="mdi-export" />
              </template>
              <v-list-item-title>Export Account</v-list-item-title>
            </v-list-item>

            <v-list-item to="/forget">
              <template #prepend>
                <v-icon color="error" icon="mdi-delete" />
              </template>
              <v-list-item-title>Forget Account</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { type PropType, ref } from 'vue'

import type { Account } from '@/types'
import { useVuetifyTheme } from '@/hooks'

export default {
  name: 'AccountChip',
  props: {
    account: {
      required: true,
      type: Object as PropType<Account>
    }
  },
  setup() {
    const showCopyNotification = ref(false)
    const theme = useVuetifyTheme()

    return { showCopyNotification, theme }
  }
}
</script>
