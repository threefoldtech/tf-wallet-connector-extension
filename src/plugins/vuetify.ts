import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const $vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#7de3c8',
          secondary: '#14A1B8',
          info: '#7de3c8',
          warning: '#FFCC00',
          link: '#5695ff'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
