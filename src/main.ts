import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/styles.scss'
import { ThreefoldWalletConnectorApi } from '@threefold/extension_api'

console.log(ThreefoldWalletConnectorApi)

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import TfWalletConnectorExtension from '@/TfWalletConnectorExtension.vue'
import { $vuetify, $globalComponents, $globalProps, $router } from '@/plugins'

createApp(TfWalletConnectorExtension)
  .use(createPinia())
  .use($vuetify)
  .use($globalComponents)
  .use($globalProps)
  .use($router)

  .mount('#app')
