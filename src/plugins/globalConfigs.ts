import type { App, Component } from 'vue'

import PasswordField from '@/components/PasswordField.vue'

function defineGlobalComponents(components: { [key: string]: Component }) {
  return (app: App<Element>) => {
    for (const key in components) {
      app.component(key, components[key])
    }
  }
}

export const $globalComponents = defineGlobalComponents({
  PasswordField
})

export function $globalProps(app: App<Element>) {
  app.config.globalProperties.$combineProps = (...objs) => {
    return objs.reduce((res, current) => ({ ...res, ...current }), {})
  }
}
