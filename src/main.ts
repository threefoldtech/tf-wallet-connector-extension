import { createApp } from 'vue'
import { createPinia } from 'pinia'

import TfWalletConnectorExtension from '@/TfWalletConnectorExtension.vue'
import $vuetify from '@/plugins/vuetify'

createApp(TfWalletConnectorExtension)
  .use(createPinia())
  .use($vuetify)

  .mount('#app')
