<template>
  <tab-layout>
    <template #warning>
      To connect your wallet, you will need to enter your mnemonic which will be encrypted using the
      password. Mnemonic will never be shared outside of this device.
    </template>

    <validate-field
      :value="mnemonic"
      :rules="[
        $validations.isRequired('Mnemonic is required.'),
        $validations.isValidMnemonic,
        $validations.isMnemonicHasTwin
      ]"
      required
      v-model="mnemonicValid"
      v-model:error="mnemonicError"
      #="{ validationProps }"
    >
      <password-field #="{ passwordFieldProps }">
        <v-text-field
          label="Mnemonic"
          placeholder="Please insert your Mnemonic"
          v-model="mnemonic"
          v-bind="$combineProps(passwordFieldProps, validationProps)"
        />
      </password-field>
    </validate-field>

    {{ mnemonicError }}

    <div class="d-flex justify-end mb-6">
      <v-btn variant="tonal" color="primary" class="mr-2">Activate Account</v-btn>
      <v-btn variant="tonal" color="secondary">Generate Account</v-btn>
    </div>

    <validate-field
      :value="password"
      v-model="passwordValid"
      required
      :rules="[
        $validations.isRequired('Password is required.'),
        $validations.minLength('Password minLength is 6 chars.', 6)
      ]"
      #="{ validationProps }"
    >
      <password-field #="{ passwordFieldProps }">
        <v-text-field
          label="Password"
          v-model="password"
          v-bind="$combineProps(passwordFieldProps, validationProps)"
        />
      </password-field>
    </validate-field>

    <validate-field
      :value="confirmPassword"
      v-model="confirmPasswordValid"
      required
      :rules="[
        $validations.isRequired('Confirm password is required.'),
        $validations.isMatch('Passwords must match each other.', () => password)
      ]"
      :deps="[password]"
      #="{ validationProps }"
    >
      <password-field #="{ passwordFieldProps }">
        <v-text-field
          label="Confirm Password"
          v-model="confirmPassword"
          v-bind="$combineProps(passwordFieldProps, validationProps)"
        />
      </password-field>
    </validate-field>

    <template #actions>
      <v-btn variant="tonal" color="primary">Connect</v-btn>
    </template>
  </tab-layout>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'ConnectWallet',
  setup() {
    const mnemonic = ref('')
    const mnemonicValid = ref(false)
    const mnemonicError = ref('')

    const password = ref('')
    const passwordValid = ref(false)

    const confirmPassword = ref('')
    const confirmPasswordValid = ref(false)

    return {
      mnemonic,
      mnemonicValid,
      mnemonicError,
      password,
      passwordValid,
      confirmPassword,
      confirmPasswordValid
    }
  }
}
</script>
