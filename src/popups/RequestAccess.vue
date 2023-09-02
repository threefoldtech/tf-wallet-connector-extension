<template>
  <ext-layout remove-actions>
    <template #title>Request access</template>
    <p>Do you want to give `this host` access to sign transactions?</p>
    <v-btn type="submit" variant="tonal" block color="error" class="mt-1" @click="accept"
      >Give Access
    </v-btn>
    <div class="mt-2 d-flex justify-center">
      <v-btn variant="plain" @click="deny"> Cancel </v-btn>
    </div>
  </ext-layout>
</template>

<script lang="ts">
export default {
  name: 'RequestAccess',

  setup() {
    function accept() {
      console.log('Accepting...')
      console.log('Popup will be closed in 3 seconds')

      setTimeout(() => {
        window.close()
      }, 3000)
    }

    function deny() {
      window.close()
    }

    return { accept, deny }
  }
}
</script>
