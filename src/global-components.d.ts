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
  REQUEST_ACCESS: 'REQUEST_ACCESS'
  RESPONSE_ACCESS: 'RESPONSE_ACCESS'
  GET_AUTH_LIST: 'GET_AUTH_LIST'
  TOGGLE_ACCESS_PERMISSION: 'TOGGLE_ACCESS_PERMISSION'
  DELETE_ACCESS_PERMISSION: 'DELETE_ACCESS_PERMISSION'
  GET_ACCOUNTS: 'GET_ACCOUNTS'
  ADD_ACCOUNT: 'ADD_ACCOUNT'
  ADD_ACCOUNTS: 'ADD_ACCOUNTS'
  UPDATE_ACCOUNT: 'UPDATE_ACCOUNT'
  DELETE_ACCOUNT: 'DELETE_ACCOUNT'
  GET_PUBLIC_ACCOUNTS: 'GET_PUBLIC_ACCOUNTS'
  LISTEN_PUBLIC_ACCOUNTS: 'LISTEN_PUBLIC_ACCOUNTS'
  STOP_LISTEN_PUBLIC_ACCOUNTS: 'STOP_LISTEN_PUBLIC_ACCOUNTS'
  HAS_ACCESS: 'HAS_ACCESS'
  REQUEST_DECRYPTED_ACCOUNT: 'REQUEST_DECRYPTED_ACCOUNT'
  SELECT_DECRYPTED_ACCOUNT: 'SELECT_DECRYPTED_ACCOUNT'
}

declare global {
  interface Window {
    $TF_WALLET_CONNECTOR_EXTENSION: 'TF_WALLET_CONNECTOR_EXTENSION'
    $TF_WALLET_CONNECTOR_EXTENSION_CMDS: TF_WALLET_CONNECTOR_EXTENSION_CMDS
  }
}
