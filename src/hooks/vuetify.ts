import { useTheme } from 'vuetify'
import { computed, type ComputedRef } from 'vue'

type Themes = 'dark' | 'light'
export interface UseVuetifyTheme {
  KEY: string
  current: Themes
  next: Themes
  isLight: boolean
  isDark: boolean
  imageLightenFilter: string
  icon: string
  toggle: () => void
  load: () => void
}
export function useVuetifyTheme(): ComputedRef<UseVuetifyTheme> {
  const KEY = 'TF_WALLET_CONNECTOR_EXTENSION_THEME'
  const theme = useTheme()

  return computed(() => {
    const current = theme.global.name.value as Themes
    return {
      KEY,
      current,
      isLight: current === 'light',
      isDark: current === 'dark',
      next: current === 'dark' ? 'light' : 'dark',
      imageLightenFilter: current === 'light' ? 'brightness(0.2)' : 'brightness(1)',
      icon: current === 'light' ? 'mdi-moon-waning-crescent' : 'mdi-brightness-4',
      toggle: () => {
        const newTheme = current === 'light' ? 'dark' : 'light'
        theme.global.name.value = newTheme
        localStorage.setItem(KEY, newTheme)
      },
      load: () => {
        theme.global.name.value = localStorage.getItem(KEY) || 'dark'
      }
    }
  })
}
