import { WALLET_KEY } from '@/constants'
import Cryptr from 'cryptr'
import md5 from 'md5'

export function downloadAsFile(name: string, data: string) {
  const a = document.createElement('a')
  a.download = name
  a.href = `data:text/raw;charset=utf-8,${encodeURIComponent(data)}`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function writeLocalWallet(mnemonic: string, password: string): void {
  const hashedPassword = md5(password)
  const cryptr = new Cryptr(hashedPassword, { pbkdf2Iterations: 10, saltLength: 10 })
  localStorage.setItem(WALLET_KEY, cryptr.encrypt(mnemonic))
}

export function readLocalWallet(password: string): string {
  const wallet = localStorage.getItem(WALLET_KEY)
  const hashedPassword = md5(password)
  const cryptr = new Cryptr(hashedPassword, { pbkdf2Iterations: 10, saltLength: 10 })

  if (wallet == null) {
    throw new Error('No wallet was found')
  }

  try {
    return cryptr.decrypt(wallet)
  } catch {
    throw new Error('Please provide a valid password')
  }
}
