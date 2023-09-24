<template>
  <ext-layout remove-actions>
    <template #title>Create new account</template>

    <form
      @submit.prevent="
        $router.push(
          `/create-account/${$route.params.mnemonic}/${$route.params.keypairType}/${name}/${password}`
        )
      "
    >
      <validate-field
        :value="name"
        :rules="[
          $validations.isRequired('Account name is required.'),
          $validations.minLength('Account name minLength is 3 chars.', 3)
        ]"
        required
        v-model="nameValid"
        #="{ validationProps }"
      >
        <v-text-field label="Account name" autofocus v-model="name" v-bind="validationProps" />
      </validate-field>

      <validate-field
        :value="password"
        :rules="[
          $validations.isRequired('Password is required.'),
          $validations.minLength('Password minLength is 6 chars.', 6)
        ]"
        required
        v-model="passwordValid"
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
        :rules="[
          $validations.isRequired('Confirm password is required.'),
          $validations.isMatch('Passwords must match each other.', () => password)
        ]"
        required
        v-model="confirmPasswordValid"
        #="{ validationProps }"
        :deps="[password]"
      >
        <password-field #="{ passwordFieldProps }">
          <v-text-field
            label="Confirm password"
            v-model="confirmPassword"
            v-bind="$combineProps(passwordFieldProps, validationProps)"
          />
        </password-field>
      </validate-field>

      <v-btn
        type="submit"
        color="primary"
        variant="tonal"
        block
        size="large"
        :disabled="!formValid"
      >
        Next step
      </v-btn>
    </form>
  </ext-layout>
</template>

<script lang="ts">
import { computed } from 'vue'
import { ref } from 'vue'

export default {
  name: 'CreateAccountPassword',
  setup() {
    const name = ref('')
    const nameValid = ref(false)

    const password = ref('')
    const passwordValid = ref(false)

    const confirmPassword = ref('')
    const confirmPasswordValid = ref(false)

    const formValid = computed(() => nameValid.value && passwordValid.value && confirmPasswordValid.value) // prettier-ignore

    return {
      name,
      nameValid,

      password,
      passwordValid,

      confirmPassword,
      confirmPasswordValid,

      formValid
    }
  }
}
</script>
