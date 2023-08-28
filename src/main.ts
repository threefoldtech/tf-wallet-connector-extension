import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import TfWalletConnectorExtension from '@/TfWalletConnectorExtension.vue'
import { $vuetify, $globalComponents, $globalProps } from '@/plugins'

createApp(TfWalletConnectorExtension)
  .use(createPinia())
  .use($vuetify)
  .use($globalComponents)
  .use($globalProps)

  .mount('#app')
