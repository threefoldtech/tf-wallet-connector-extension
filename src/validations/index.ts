import { validateMnemonic } from 'bip39'
import { isAddress } from '@polkadot/util-crypto'

export function isRequired(message: string) {
  return (value: string) => {
    return value ? undefined : message
  }
}

export function isValidMnemonic(mnemonic: string) {
  if (
    validateMnemonic(mnemonic) ||
    (mnemonic.length === 66 && isAddress(mnemonic)) ||
    (mnemonic.length === 64 && isAddress(`0x${mnemonic}`))
  ) {
    return
  }

  return "Mnemonic or Hex Seed doesn't seem to be valid."
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
