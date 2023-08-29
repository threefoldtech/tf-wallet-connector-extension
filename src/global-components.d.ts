import type PasswordField from './components/PasswordField.vue'
import type TabLayout from './components/TabLayout.vue'
import type ValidateField from './components/ValidateField.vue'
import type TermsDialog from './components/TermsDialog.vue'

import type * as validations from './validations'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    PasswordField: typeof PasswordField
    TabLayout: typeof TabLayout
    ValidateField: typeof ValidateField
    TermsDialog: typeof TermsDialog
  }

  export interface ComponentCustomProperties {
    $combineProps: (...Object: any[]) => Object
    $validations: typeof validations
  }
}

interface TF_WALLET_CONNECTOR_EXTENSION_CMDS {
  Login: 'LOGIN'
  Logout: 'LOGOUT'
  GetSessionStorage: 'GET_SESSION_STORAGE'
}

declare global {
  interface Window {
    $TF_WALLET_CONNECTOR_EXTENSION: 'TF_WALLET_CONNECTOR_EXTENSION'
    $TF_WALLET_CONNECTOR_EXTENSION_CMDS: TF_WALLET_CONNECTOR_EXTENSION_CMDS
  }
}
