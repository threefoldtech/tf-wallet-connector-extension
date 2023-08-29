<template>
  <v-alert type="warning" variant="tonal" class="mb-8" v-if="$slots['warning']">
    <slot name="warning"></slot>
  </v-alert>

  <slot></slot>

  <template v-if="$slots['actions']">
    <div class="d-flex justify-center mt-2">
      <slot name="actions"></slot>
    </div>
  </template>
</template>

<script lang="ts">
export default {
  name: 'TabLayout'
}
</script>
