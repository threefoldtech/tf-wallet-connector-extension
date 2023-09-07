<template>
  <v-snackbar timeout="1500" :theme="theme.next" variant="tonal" v-model="show">
    <p>Copied</p>
    <template #activator="{ props }">
      <slot
        :copyFieldProps="
          $combineProps(props, {
            onClick: () => {
              show = true
              $copy(data)
            },
            theme: theme.current
          })
        "
        :copyInputProps="{
          'append-inner-icon': 'mdi-content-copy',
          'onClick:append-inner': () => {
            show = true
            $copy(data)
          }
        }"
      ></slot>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { useVuetifyTheme } from '@/hooks'
import { ref } from 'vue'

export default {
  name: 'CopyField',
  props: {
    data: { type: String, required: true }
  },
  setup() {
    const theme = useVuetifyTheme()
    const show = ref(false)

    return { theme, show }
  }
}
</script>
