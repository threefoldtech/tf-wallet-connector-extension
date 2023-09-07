import type PasswordField from './components/PasswordField.vue'
import type TabLayout from './components/TabLayout.vue'
import type ValidateField from './components/ValidateField.vue'
import type TermsDialog from './components/TermsDialog.vue'
import type ExtLayout from './components/Layout.vue'
import type AccountChip from './components/AccountChip.vue'
import type CopyField from './components/CopyField.vue'
import type NetworkField from './components/NetworkField.vue'

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
    NetworkField: typeof NetworkField
  }

  export interface ComponentCustomProperties {
    $combineProps: (...Object: any[]) => Object
    $validations: typeof validations
    $copy: (data: string) => void
  }
}

interface TF_WALLET_CONNECTOR_EXTENSION_CMDS {
  REQUEST_ACCESS: 'REQUEST_ACCESS'
  RESPONSE_ACCESS: 'RESPONSE_ACCESS'
  GET_PUBLIC_ACCOUNTS: 'GET_PUBLIC_ACCOUNTS'
  GET_AUTH_LIST: 'GET_AUTH_LIST'
  LISTEN_PUBLIC_ACCOUNTS: 'LISTEN_PUBLIC_ACCOUNTS'
  LISTEN_AUTH_LIST: 'LISTEN_AUTH_LIST'
  STOP_LISTEN_PUBLIC_ACCOUNTS: 'STOP_LISTEN_PUBLIC_ACCOUNTS'
  STOP_LISTEN_AUTH_LIST: 'STOP_LISTEN_AUTH_LIST'
  HAS_ACCESS: 'HAS_ACCESS'
  SELECT_ACCOUNT: 'SELECT_ACCOUNT'
  REQUEST_DECRYPTED_ACCOUNT: 'REQUEST_DECRYPTED_ACCOUNT'
  SELECT_DECRYPTED_ACCOUNT: 'SELECT_DECRYPTED_ACCOUNT'
  SIGN: 'SIGN'
}

declare global {
  interface Window {
    $TF_WALLET_CONNECTOR_EXTENSION: 'TF_WALLET_CONNECTOR_EXTENSION'
    $TF_WALLET_CONNECTOR_EXTENSION_CMDS: TF_WALLET_CONNECTOR_EXTENSION_CMDS
  }
}
