import type { App, Component } from 'vue'

import PasswordField from '@/components/PasswordField.vue'
import TabLayout from '@/components/TabLayout.vue'
import ValidateField from '@/components/ValidateField.vue'
import TermsDialog from '@/components/TermsDialog.vue'
import ExtLayout from '@/components/Layout.vue'
import AccountChip from '@/components/AccountChip.vue'
import CopyField from '@/components/CopyField.vue'
import NetworkField from '@/components/NetworkField.vue'
import NetworkLog from '@/components/NetworkLog.vue'
import NetworkLogs from '@/components/NetworkLogs.vue'

import * as $validations from '@/validations'

function defineGlobalComponents(components: { [key: string]: Component }) {
  return (app: App<Element>) => {
    for (const key in components) {
      app.component(key, components[key])
    }
  }
}

export const $globalComponents = defineGlobalComponents({
  PasswordField,
  TabLayout,
  ValidateField,
  TermsDialog,
  ExtLayout,
  AccountChip,
  CopyField,
  NetworkField,
  NetworkLog,
  NetworkLogs
})

export function $globalProps(app: App<Element>) {
  app.config.globalProperties.$validations = $validations
  app.config.globalProperties.$combineProps = (...objs) => {
    return objs.reduce((res, current) => ({ ...res, ...current }), {})
  }
  app.config.globalProperties.$copy = (data: string) => {
    window.navigator.clipboard.writeText(data)
  }
}
