<template>
  <v-app :style="{ width: '535px' }">
    <ext-layout v-model:search="search">
      <template #title>Accounts</template>

      <account-chip v-for="account in accounts" :key="account.name" :account="account" />
    </ext-layout>
  </v-app>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useWalletStore } from '@/stores'
import { useVuetifyTheme } from '@/hooks'

import AccountChip from '@/components/AccountChip.vue'

export default {
  name: 'tf-wallet-connector-extension',
  components: { AccountChip },
  setup() {
    const walletStore = useWalletStore()
    const theme = useVuetifyTheme()
    const search = ref('')

    onMounted(() => {
      theme.value.load()
      walletStore.init()
    })

    const allAccounts = Array.from({ length: 2 }).map((_, i) => ({
      name: 'admin' + i,
      mnemonic: 'rebuild eager divide effort three frown plate picnic hungry drink size van',
      ssh: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDPHqunwzmMIW1rDyKhZ36CATFhfioYX3tpT6a7vQfv07IoIMcescAl4mNtbbx+TyqQby+i7x2noFTWKttM6RLJMaci1tJ0kzhdqJNp9vIQy6D8JT9l9rB1uGkUdJB6GFiXP2X+Mg/lMHRF+/2fh6D0YqqJEPnNqa63qPzWwHyhs/X8bkuNN5XtSEOuuIKu9X2TbLLZb/xwlOmWAD8DHll8GRbudVQdY3eRjqpRuslMuja5Jjx4XHNEDP274mK0mt2I2LgvWgPFREzvbztKdfnCvMD/utRztMp089c2bvTyo9BopxHxgCrXcyYfOcTH+XWUI9yIk9nwciLVvDuxWKFM6HmXQLThu0Yo4w4qTvvj9/sm9SI1EcFsdPT8WNbFEUL648KDZ5HPQghU1yXDIpKw+XhQ3wb907d8ngkVKzKriFywb1qQq436mX7HUQi+7ge37AMgg1xTxucNd+2n/vWJGkVuV+xFP50LiI0bwq3ysvULVQTV9dVeOPzG2L6FsTOURsNwNL3b/wxPcMcKHV2fxEeTtp8q4ROomstGLVxJlUJzs0t5xEv0QFVpLbKGD+flmo7nEnfI+JgXkhtlLPoDW+EFf7iacA8rojoinxfxFKj9KYc2s+B+d1xPe6B6b0ddTxjTcmFF6RTEuddTHPO2YnLw3/gaQhKkmKJstT4sjQ== Threefold',
      twinId: 370,
      address: '5EPdJRyju5DS1xhBWzo6JzLek8MnbcwUEQVLaPZRDLuMMhUv',
      relay: 'relay.dev.grid.tf',
      visible: i === 0
    }))

    const accounts = computed(() => {
      return allAccounts.filter((account) => account.name.includes(search.value))
    })

    return { walletStore, search, accounts }
  }
}
</script>
