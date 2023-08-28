import { validateMnemonic } from 'bip39'
import { loadGrid } from '@/utils'

export function isRequired(message: string) {
  return (value: string) => {
    return value ? undefined : message
  }
}

export function isValidMnemonic(mnemonic: string) {
  return validateMnemonic(mnemonic) ? undefined : "Mnemonic doesn't seem to be valid."
}

export async function isMnemonicHasTwin(mnemonic: string) {
  try {
    await loadGrid(mnemonic)
  } catch (error) {
    return (error as Error).message || 'Something went wrong while loading grid.'
  }
}

export function isMatch(message: string, getToMatch: () => string) {
  return (value: string) => {
    return value === getToMatch() ? undefined : message
  }
}

export function minLength(message: string, length: number) {
  return (value: string = '') => {
    return value.length >= length ? undefined : message
  }
}
