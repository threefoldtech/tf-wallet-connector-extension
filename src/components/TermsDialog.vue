<template>
  <v-dialog model-value @update:model-value="close" fullscreen>
    <v-card class="h-100" v-if="!loadedTerms">
      <v-card-text class="h-100 w-100 d-flex justify-center align-center">
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-card-text>
    </v-card>

    <iframe
      v-show="loadedTerms"
      src="https://library.threefold.me/info/legal/#/"
      frameborder="0"
      allow="fullscreen"
      height="95%"
      width="100%"
      sandbox="allow-forms allow-modals allow-scripts allow-popups allow-same-origin"
      @load="loadedTerms = true"
    />
    <v-btn v-show="loadedTerms" block class="font-weight-bold rounded-0" @click="accept">
      Accept terms and conditions
    </v-btn>
  </v-dialog>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'TermsDialog',
  props: {
    modelValue: Boolean
  },
  emits: {
    'update:model-value': (value: boolean) => value,
    accept: () => void 0
  },
  setup(_, { emit }) {
    const loadedTerms = ref(false)

    function close() {
      emit('update:model-value', false)
    }

    function accept() {
      emit('accept')
      close()
    }

    return { loadedTerms, close, accept }
  }
}
</script>
