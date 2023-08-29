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
