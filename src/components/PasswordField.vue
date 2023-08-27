<template>
  <slot
    :passwordFieldProps="{
      'append-inner-icon': hide ? 'mdi-eye-off-outline' : 'mdi-eye',
      type: hide ? 'password' : 'text',
      'onClick:append-inner': toggleHide
    }"
  ></slot>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'PasswordField',
  setup() {
    const hide = ref(true)

    function toggleHide() {
      hide.value = !hide.value
    }

    return { hide, toggleHide }
  }
}
</script>
