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
      :disabled="disabled || disableSSH"
      spellcheck="false"
      v-bind="validationProps"
    />
  </validate-field>

  <network-logs
    :networks="$props.networks"
    :status="ssh && ssh === account.ssh ? 'success' : undefined"
    force-update
    pending-message="Pending to update public ssh key."
    loading-message="Updating your public ssh key."
    success-message="Public ssh key is up to date."
    fail-message="Failed to update public ssh key."
    :callback="updateSSHCallback"
    ref="logsService"
  />

  <div class="d-flex mb-6 mt-1">
    <v-btn
      class="mr-2"
      variant="tonal"
      color="secondary"
      :disabled="disabled || !!ssh"
      :loading="generatingSSh"
      @click="
        () => {
          if (noPassword) {
            return generateSSH(account.mnemonic)
          }
          askForPassword = true
        }
      "
    >
      Generate SSH Keys
    </v-btn>
    <v-btn
      variant="tonal"
      color="primary"
      :disabled="disabled || ssh === account.ssh || !ssh"
      :loading="updatingSSH"
      @click="
        () => {
          if (noPassword) {
            return updateSSH(account.mnemonic)
          }
          askForPassword = true
        }
      "
    >
      Update Public SSH Key
    </v-btn>
  </div>

  <v-dialog v-model="askForPassword">
    <v-card>
      <v-card-title>Provide your account password</v-card-title>
      <v-card-text>
        <form @submit.prevent>
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

import { loadGrid, storeSSH, downloadAsFile } from '@/utils'
import type { PropType } from 'vue'
import type { Account } from '@/types'

import { useLogsService } from './NetworkLogs.vue'

export default {
  name: 'SshField',
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true
    },
    loading: Boolean,
    noPassword: {
      type: Boolean,
      default: () => false
    },
    networks: {
      type: Array as PropType<string[]>,
      required: true
    },
    publicSsh: String,
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  emits: {
    'update:loading': (value: boolean) => true || value,
    'update:public-ssh': (value: string) => true || value
  },
  setup(props, { emit }) {
    const logsService = useLogsService()
    const password = ref('')
    const passwordError = ref('')
    const askForPassword = ref(false)
    const ssh = ref(props.account.ssh || '')

    const generatingSSh = ref(false)
    async function generateSSH(mnemonic: string) {
      generatingSSh.value = true
      const keys = await generateKeyPair({
        alg: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        name: 'Threefold',
        size: 4096
      })
      await logsService.value.trigger(mnemonic, keys.publicKey)
      ssh.value = keys.publicKey
      downloadAsFile('id_rsa', keys.privateKey)
      emit('update:public-ssh', keys.publicKey)
      generatingSSh.value = false
    }

    const updatingSSH = ref(false)
    async function updateSSH(mnemonic: string) {
      updatingSSH.value = true
      await logsService.value.trigger(mnemonic, ssh.value)
      emit('update:public-ssh', ssh.value)
      updatingSSH.value = false
    }

    function updateSSHCallback(network: string) {
      return async (mnemonic: string, newSsh: string) => {
        return loadGrid(mnemonic, network).then((grid) => storeSSH(grid, newSsh))
      }
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
      logsService,
      ssh,
      password,
      checkPasswordAndContinue,
      updateSSHCallback,
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
