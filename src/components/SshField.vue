<template>
  <validate-field
    required
    :value="ssh"
    :rules="[$validations.isRequired('Public SSH Key is required.')]"
    :disabled="disableSSH"
  >
    <v-textarea
      label="Public SSH Key"
      v-model="ssh"
      no-resize
      :disabled="disableSSH"
      spellcheck="false"
    />
  </validate-field>

  <div class="d-flex justify-end mb-6">
    <v-btn
      class="mr-2"
      variant="tonal"
      color="secondary"
      :disabled="!!ssh"
      :loading="generatingSSh"
      @click="generateSSH"
    >
      Generate SSH Keys
    </v-btn>
    <v-btn
      variant="tonal"
      color="primary"
      :disabled="ssh === walletStore.account!.ssh || !ssh"
      :loading="updatingSSH"
      @click="updateSSH"
    >
      Update Public SSH Key
    </v-btn>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import { generateKeyPair } from 'web-ssh-keygen'

import { useWalletStore } from '@/stores'
import { loadGrid, storeSSH, downloadAsFile } from '@/utils'

export default {
  name: 'SshField',
  props: { loading: Boolean },
  emits: { 'update:loading': (value: boolean) => true },
  setup(_, { emit }) {
    const walletStore = useWalletStore()

    const ssh = ref(walletStore.account!.ssh)

    const generatingSSh = ref(false)
    async function generateSSH() {
      generatingSSh.value = true
      const keys = await generateKeyPair({
        alg: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        name: 'Threefold',
        size: 4096
      })
      await _updateSSH(keys.publicKey)
      ssh.value = keys.publicKey
      downloadAsFile('id_rsa', keys.privateKey)
      generatingSSh.value = false
    }

    const updatingSSH = ref(false)
    async function updateSSH() {
      updatingSSH.value = true
      await _updateSSH(ssh.value)
      updatingSSH.value = false
    }

    async function _updateSSH(newSsh: string) {
      const grid = await loadGrid(walletStore.account!.mnemonic)
      await storeSSH(grid, newSsh)
      await walletStore.updateSSH(newSsh)
    }

    const disableSSH = computed(() => generatingSSh.value || updatingSSH.value)
    watch(disableSSH, (loading) => emit('update:loading', loading))

    return { walletStore, ssh, disableSSH, generatingSSh, generateSSH, updatingSSH, updateSSH }
  }
}
</script>
