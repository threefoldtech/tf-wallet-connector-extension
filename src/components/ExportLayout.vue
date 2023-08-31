<template>
  <ext-layout>
    <template #title>
      <slot name="title"></slot>
    </template>
    <account-chip v-if="account" :account="account" remove-actions />
    <v-alert type="warning" variant="tonal">
      <slot name="warning"></slot>
    </v-alert>
    <form @submit.prevent="onExport">
      <password-field #="{ passwordFieldProps }">
        <validate-field
          :value="$props.modelValue"
          :rules="[
            $validations.isRequired('Password is required.'),
            $validations.minLength('Password minLength is 6 chars.', 6)
          ]"
          required
          #="{ validationProps }"
          v-model="passwordValid"
        >
          <v-text-field
            :label="passwordLabel"
            autofocus
            class="mt-4"
            :model-value="$props.modelValue"
            @update:model-value="$emit('update:model-value', $event)"
            v-bind="$combineProps(passwordFieldProps, validationProps)"
          />
        </validate-field>
      </password-field>
      <v-btn
        type="submit"
        :disabled="!passwordValid"
        variant="tonal"
        block
        color="error"
        class="mt-1"
      >
        <slot name="export-label"></slot>
      </v-btn>
    </form>
    <div class="mt-2 d-flex justify-center">
      <v-btn variant="plain" @click="toAccountList"> Cancel </v-btn>
    </div>
  </ext-layout>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { ref, type PropType } from 'vue'

import type { Account } from '@/types'

export default {
  name: 'ExportAccount',
  props: {
    passwordLabel: { type: String, required: true },
    modelValue: { type: String, required: true },
    account: Object as PropType<Account>
  },
  emits: {
    'update:model-value': (value: string) => true || value,
    export: (next: () => void) => true || next
  },
  setup(_, { emit }) {
    const router = useRouter()
    const passwordValid = ref(false)

    function toAccountList() {
      router.push('/')
    }

    function onExport() {
      emit('export', toAccountList)
    }

    return { passwordValid, toAccountList, onExport }
  }
}
</script>
