<template>
  <validate-field
    required
    :value="ssh"
    :rules="[$validations.isRequired('Public SSH Key is required.')]"
    :disabled="disableSSH"
    #="{ validationProps }"
  >
    <v-textarea
      label="Public SSH Key"
      v-model="ssh"
      no-resize
      :disabled="disableSSH"
      spellcheck="false"
      v-bind="validationProps"
    />
  </validate-field>

  <div class="d-flex justify-end mb-6 mt-1">
    <v-btn
      class="mr-2"
      variant="tonal"
      color="secondary"
      :disabled="!!ssh"
      :loading="generatingSSh"
      @click="askForPassword = true"
    >
      Generate SSH Keys
    </v-btn>
    <v-btn
      variant="tonal"
      color="primary"
      :disabled="ssh === account.ssh || !ssh"
      :loading="updatingSSH"
      @click="askForPassword = true"
    >
      Update Public SSH Key
    </v-btn>
  </div>

  <v-dialog v-model="askForPassword">
    <v-card>
      <v-card-title>Provide your account password</v-card-title>
      <v-card-text>
        <form @submit.prevent="">
          <validate-field
            :rules="[
              $validations.isRequired('Password is required.'),
              $validations.minLength('Password minLength is 6 chars.', 6)
            ]"
            required
            :value="password"
            #="{ validationProps }"
          >
            <v-text-field
              label="Account Password"
              type="password"
              :model-value="password"
              @update:model-value="
                ($event) => {
                  password = $event
                  if (passwordError) {
                    passwordError = ''
                  }
                }
              "
              autofocus
              v-bind="validationProps"
            />
          </validate-field>
          <v-alert type="error" variant="tonal" class="mb-4" v-if="passwordError">{{
            passwordError
          }}</v-alert>
          <div class="d-flex justify-center">
            <v-btn color="primary" class="mr-2" variant="tonal" @click="checkPasswordAndContinue">
              Continue
            </v-btn>
            <v-btn color="error" variant="text" @click="askForPassword = false">Cancel</v-btn>
          </div>
        </form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import { generateKeyPair } from 'web-ssh-keygen'
import md5 from 'md5'
import Cryptr from 'cryptr'

import { useWalletStore } from '@/stores'
import { loadGrid, storeSSH, downloadAsFile } from '@/utils'
import type { PropType } from 'vue'
import type { Account } from '@/types'

export default {
  name: 'SshField',
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true
    },
    loading: Boolean
  },
  emits: { 'update:loading': (value: boolean) => true || value },
  setup(props, { emit }) {
    const walletStore = useWalletStore()
    const password = ref('')
    const passwordError = ref('')
    const askForPassword = ref(false)
    const ssh = ref(props.account.ssh)

    const generatingSSh = ref(false)
    async function generateSSH(mnemonic: string) {
      generatingSSh.value = true
      const keys = await generateKeyPair({
        alg: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        name: 'Threefold',
        size: 4096
      })
      await _updateSSH(mnemonic, keys.publicKey)
      ssh.value = keys.publicKey
      downloadAsFile('id_rsa', keys.privateKey)
      generatingSSh.value = false
    }

    const updatingSSH = ref(false)
    async function updateSSH(mnemonic: string) {
      updatingSSH.value = true
      await _updateSSH(mnemonic, ssh.value)
      updatingSSH.value = false
    }

    async function _updateSSH(mnemonic: string, newSsh: string) {
      const grid = await loadGrid(mnemonic)
      await storeSSH(grid, newSsh)
      await walletStore.updateSSH(newSsh, props.account.mnemonic)
    }

    const disableSSH = computed(() => generatingSSh.value || updatingSSH.value)
    watch(disableSSH, (loading) => emit('update:loading', loading))

    function checkPasswordAndContinue() {
      let mnemonic: string = ''

      try {
        const hashPassword = md5(password.value)
        const cryptr = new Cryptr(hashPassword, { saltLength: 10, pbkdf2Iterations: 10 })
        mnemonic = cryptr.decrypt(props.account.mnemonic)
        askForPassword.value = false
      } catch (error) {
        passwordError.value = "Password you provided isn't valid"
        return
      }

      ssh.value ? updateSSH(mnemonic) : generateSSH(mnemonic)
    }

    return {
      ssh,
      password,
      checkPasswordAndContinue,
      askForPassword,
      passwordError,
      disableSSH,
      generatingSSh,
      generateSSH,
      updatingSSH,
      updateSSH
    }
  }
}
</script>
