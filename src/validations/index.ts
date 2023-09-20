import { validateMnemonic } from 'bip39'

export function isRequired(message: string) {
  return (value: string) => {
    return value ? undefined : message
  }
}

export function isValidMnemonic(mnemonic: string) {
  return validateMnemonic(mnemonic) ? undefined : "Mnemonic doesn't seem to be valid."
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
