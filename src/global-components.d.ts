import type PasswordField from './components/PasswordField.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    PasswordField: typeof PasswordField
  }

  export interface ComponentCustomProperties {
    $combineProps: (...Object: any[]) => Object
  }
}
