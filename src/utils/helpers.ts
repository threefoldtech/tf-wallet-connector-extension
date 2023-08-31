import { WALLET_KEY } from '@/constants'
import type { Account } from '@/types'
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

export function readBackupFile(file: File): Promise<{ accounts: Account[]; encrypted: string }> {
  return new Promise((res, rej) => {
    const fileReader = new FileReader()
    fileReader.addEventListener(
      'load',
      (event) => {
        if (!event.target) {
          return rej('Failed to read file `' + file.name + '`.')
        }

        const { result } = event.target
        if (!result) {
          return rej('File is empty.')
        }

        try {
          const parsedResult = JSON.parse(result as string)
          if (
            typeof parsedResult !== 'object' ||
            !('encrypted' in parsedResult) ||
            !('accounts' in parsedResult) ||
            typeof parsedResult.encrypted !== 'string' ||
            parsedResult.encrypted.trim().length === 0 ||
            !Array.isArray(parsedResult.accounts) ||
            parsedResult.accounts.length === 0
          ) {
            throw new Error()
          }
          return res(parsedResult)
        } catch {
          return rej('Please provide a valid backup format.')
        }
      },
      { once: true }
    )
    fileReader.readAsText(file)
  })
}
