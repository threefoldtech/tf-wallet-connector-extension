import type PasswordField from './components/PasswordField.vue'
import type TabLayout from './components/TabLayout.vue'
import type ValidateField from './components/ValidateField.vue'
import type TermsDialog from './components/TermsDialog.vue'
import type ExtLayout from './components/Layout.vue'
import type AccountChip from './components/AccountChip.vue'
import type CopyField from './components/CopyField.vue'

import type * as validations from './validations'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    PasswordField: typeof PasswordField
    TabLayout: typeof TabLayout
    ValidateField: typeof ValidateField
    TermsDialog: typeof TermsDialog
    ExtLayout: typeof ExtLayout
    AccountChip: typeof AccountChip
    CopyField: typeof CopyField
  }

  export interface ComponentCustomProperties {
    $combineProps: (...Object: any[]) => Object
    $validations: typeof validations
    $copy: (data: string) => void
  }
}

interface TF_WALLET_CONNECTOR_EXTENSION_CMDS {
  Login: 'LOGIN'
  Logout: 'LOGOUT'
  GetSessionStorage: 'GET_SESSION_STORAGE'
  RequestAccess: 'REQUEST_ACCESS'
}

declare global {
  interface Window {
    $TF_WALLET_CONNECTOR_EXTENSION: 'TF_WALLET_CONNECTOR_EXTENSION'
    $TF_WALLET_CONNECTOR_EXTENSION_CMDS: TF_WALLET_CONNECTOR_EXTENSION_CMDS
  }
}
