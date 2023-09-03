<template>
  <ext-layout>
    <template #title>Manage websites access</template>

    <v-progress-circular indeterminate color="primary" size="50" v-if="loading" />
    <template v-else>
      <v-text-field
        variant="underlined"
        class="mx-4"
        placeholder="localhost"
        autofocus
        clearable
        prepend-inner-icon="mdi-account"
        v-model="search"
        @click:clear="search = ''"
      />
      <v-list lines="one">
        <v-divider />
        <template v-for="url in Object.keys(accessList)" :key="url">
          <v-list-item>
            <v-list-item-title class="font-weight-bold">{{ url }}</v-list-item-title>
            <template #append>
              <v-list-item-action>
                <v-tooltip text="Toggle access permission" :theme="theme.next">
                  <template #activator="{ props }">
                    <v-switch
                      hide-details
                      :model-value="accessList[url]"
                      @update:model-value="togglePermission(url)"
                      color="secondary"
                      inset
                      v-bind="props"
                      :theme="theme.current"
                    />
                  </template>
                </v-tooltip>
                <v-divider vertical class="mx-2" />
                <v-tooltip text="Remove website access" :theme="theme.next">
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      :theme="theme.current"
                      v-bind="props"
                      @click="deletePermission(url)"
                    />
                  </template>
                </v-tooltip>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-divider />
        </template>
      </v-list>
    </template>
  </ext-layout>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

import { sendMessageToContent } from '@/utils'
import { useVuetifyTheme } from '@/hooks'
import { computed } from 'vue'

export default {
  name: 'ManageAccess',
  setup() {
    const theme = useVuetifyTheme()
    const loading = ref(true)
    const _accessList = ref<{ [url: string]: boolean }>({})
    const search = ref('')

    onMounted(async () => {
      if (import.meta.env.DEV) {
        _accessList.value = { 'http://localhost:5174': true, 'http://localhost:5173': false }
      } else {
        _accessList.value = await sendMessageToContent('GET_AUTH_LIST')
      }

      loading.value = false
    })

    async function togglePermission(url: string) {
      await sendMessageToContent('TOGGLE_ACCESS_PERMISSION', url)
      _accessList.value[url] = !_accessList.value[url]
    }

    async function deletePermission(url: string) {
      await sendMessageToContent('DELETE_ACCESS_PERMISSION', url)
      delete _accessList.value[url]
    }

    const accessList = computed(() => {
      const list = _accessList.value
      const query = search.value.toLowerCase()
      const keys = Object.keys(list).filter((key) => key.toLowerCase().includes(query))
      return keys.reduce(
        (res, key) => {
          res[key] = list[key]
          return res
        },
        {} as { [url: string]: Boolean }
      )
    })

    return { theme, loading, accessList, togglePermission, deletePermission, search }
  }
}
</script>
