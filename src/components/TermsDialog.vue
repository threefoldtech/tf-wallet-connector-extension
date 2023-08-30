<template>
  <v-dialog model-value @update:model-value="close">
    <div :style="{ height: 'calc(100vh - 40px)', width: 'calc(100vw - 40px)' }">
      <v-card class="h-100" v-if="!loadedTerms">
        <v-card-text class="h-100 w-100 d-flex justify-center align-center">
          <div class="d-flex flex-column align-center">
            <v-progress-circular indeterminate color="primary" size="50" />
            <p class="mt-2 font-weight-bold text-subtitle-1">Loading Terms and conditions...</p>
          </div>
        </v-card-text>
      </v-card>

      <iframe
        v-show="loadedTerms"
        src="https://library.threefold.me/info/legal/#/"
        frameborder="0"
        allow="fullscreen"
        sandbox="allow-forms allow-modals allow-scripts allow-popups allow-same-origin"
        @load="loadedTerms = true"
        class="w-100"
        :style="{ height: 'calc(100% - 50px)' }"
      />
      <v-btn
        v-show="loadedTerms"
        block
        class="font-weight-bold rounded-0"
        :style="{ height: '50px' }"
        @click="accept"
      >
        Accept terms and conditions
      </v-btn>
    </div>
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
