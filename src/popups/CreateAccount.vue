<template>
  <ext-layout remove-actions>
    <template #title>Create new account</template>

    <v-alert type="warning" variant="tonal" class="mb-4">
      Please write down your wallet's mnemonic seed and keep it in a safe place. The mnemonic can be
      used to restore your wallet. Keep it carefully to not lose your assets.
    </v-alert>

    <v-textarea label="Your mnemonic" readonly v-model="mnemonic" rows="2" no-resize>
      <template #append-inner>
        <copy-field :data="mnemonic" event="Click:append-inner" #="{ copyFieldProps }">
          <v-tooltip text="Copy mnemonic">
            <template #activator="{ props }">
              <v-btn
                variant="plain"
                icon="mdi-content-copy"
                v-bind="$combineProps(props, copyFieldProps)"
              />
            </template>
          </v-tooltip>
        </copy-field>
      </template>
    </v-textarea>

    <v-select label="Keypair Type" :items="['sr25519', 'ed25519']" v-model="keypairType" />
    <v-checkbox label="I have saved my mnemonic seed safely." color="secondary" v-model="saved" />

    <v-btn
      color="primary"
      variant="tonal"
      :disabled="!saved"
      block
      size="large"
      :style="{ marginTop: '-20px' }"
      @click="$router.push(`/create-account/${mnemonic}/${keypairType}`)"
    >
      Next step
    </v-btn>
  </ext-layout>
</template>

<script lang="ts">
import { generateMnemonic } from 'bip39'
import { ref } from 'vue'

export default {
  name: 'CreateAccount',
  setup() {
    const mnemonic = generateMnemonic()
    const keypairType = ref('sr25519')
    const saved = ref(false)

    return { mnemonic, saved, keypairType }
  }
}
</script>
