<template>
  <v-alert type="warning" variant="tonal" class="mb-8">
    To connect your wallet, you will need to enter your mnemonic which will be encrypted using the
    password. Mnemonic will never be shared outside of this device.
  </v-alert>
  <password-field #="{ passwordFieldProps }">
    <v-text-field
      label="Mnemonic"
      placeholder="Please insert your Mnemonic"
      v-bind="passwordFieldProps"
    />
  </password-field>
  <div class="d-flex justify-end mb-6">
    <v-btn variant="tonal" color="primary" class="mr-2">Activate Account</v-btn>
    <v-btn variant="tonal" color="secondary">Generate Account</v-btn>
  </div>

  <password-field #="{ passwordFieldProps }">
    <v-text-field label="Password" v-bind="passwordFieldProps" />
  </password-field>

  <password-field #="{ passwordFieldProps }">
    <v-text-field label="Confirm Password" v-bind="passwordFieldProps" />
  </password-field>
</template>

<script lang="ts">
export default {
  name: 'ConnectWallet'
}
</script>
