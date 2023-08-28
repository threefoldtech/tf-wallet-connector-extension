<template>
  <slot
    :validationProps="{
      onBlur: touched ? undefined : onBlur,
      'error-messages': errorMessage,
      error: !!errorMessage,
      hint: validating ? 'validating...' : undefined
    }"
  ></slot>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'

export default {
  name: 'ValidateField',
  props: {
    value: {
      required: true,
      type: String
    },
    rules: {
      required: true,
      type: Array as PropType<Array<(value: string) => void | string | Promise<void | string>>>
    },
    required: {
      type: Boolean,
      required: false,
      default: () => false
    },
    modelValue: Boolean,
    error: String,
    deps: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  emits: {
    'update:model-value': (value: boolean) => value,
    'update:error': (error: string) => error
  },
  setup(props, { emit }) {
    const touched = ref(false)
    async function onBlur() {
      touched.value = true
      await validate()
    }

    watch(
      () => props.value,
      async () => {
        if (!touched.value) {
          touched.value = true
        }

        await validate()
      }
    )

    watch(
      () => props.deps,
      async () => {
        if (!touched.value) {
          return
        }

        await validate()
      }
    )

    const errorMessage = ref('')
    function setError(newError: string) {
      errorMessage.value = newError
      emit('update:error', newError)
    }
    const validating = ref(false)
    async function validate() {
      setError('')
      if (!props.value && !props.required) {
        emit('update:model-value', true)
        return
      }

      for (const rule of props.rules) {
        const initRes = rule(props.value)
        if (initRes instanceof Promise && !validating.value) {
          validating.value = true
        }

        const res = await initRes
        if (typeof res === 'string') {
          setError(res)
          emit('update:model-value', false)
          break
        }
      }

      if (validating.value) {
        validating.value = false
      }

      if (!errorMessage.value) {
        emit('update:model-value', true)
      }
    }

    return { touched, onBlur, errorMessage, validating }
  }
}
</script>
