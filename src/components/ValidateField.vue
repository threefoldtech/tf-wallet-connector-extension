<template>
  <slot
    :validationProps="{
      onBlur: touched || disabled ? undefined : onBlur,
      'error-messages': disabled ? undefined : errorMessage,
      error: !!errorMessage && !disabled,
      hint: validatingInput && !disabled ? 'validating...' : undefined
    }"
  ></slot>
</template>

<script lang="ts">
import { type PropType, watch, ref } from 'vue'

import { type ValidateField } from '@/hooks'

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
    validating: Boolean,
    disabled: Boolean,
    deps: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  emits: {
    'update:model-value': (value: boolean) => true,
    'update:error': (error: string) => true,
    'update:validating': (validating: boolean) => true
  },
  setup(props, { emit, expose }) {
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
      if (errorMessage.value !== newError) {
        errorMessage.value = newError
        emit('update:error', newError)
      }
    }

    const validatingInput = ref(false)
    function setValidating(newValidating: boolean) {
      validatingInput.value = newValidating
      emit('update:validating', newValidating)
    }

    async function validate() {
      setError('')
      if (!props.value && !props.required) {
        emit('update:model-value', true)
        return
      }

      for (const rule of props.rules) {
        const initRes = rule(props.value)
        if (initRes instanceof Promise && !validatingInput.value) {
          setValidating(true)
        }

        const res = await initRes
        if (typeof res === 'string') {
          setError(res)
          emit('update:model-value', false)
          break
        }
      }

      if (validatingInput.value) {
        setValidating(false)
      }

      if (!errorMessage.value) {
        emit('update:model-value', true)
      }
    }

    expose(<ValidateField>{
      validate
    })

    return { touched, onBlur, errorMessage, validatingInput }
  }
}
</script>
