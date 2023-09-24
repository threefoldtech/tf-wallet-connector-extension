import type { Account, AuthList } from '@/types'
import { sendMessageToContent } from './extension'

const ACCOUNTS = 'TF_WALLET_CONNECTOR_EXTENSION_ACCOUNTS'
const AUTH_LIST = 'TF_WALLET_CONNECTOR_EXTENSION_AUTH_LIST'

class Storage {
  public get accounts(): Promise<Account[]> {
    if (import.meta.env.DEV) return Promise.resolve([])

    return chrome.storage.sync
      .get(ACCOUNTS)
      .then((storage) => storage[ACCOUNTS])
      .then((accounts) => JSON.parse(accounts || '[]'))
  }

  public get authList(): Promise<AuthList> {
    if (import.meta.env.DEV) return Promise.resolve({})

    return chrome.storage.sync
      .get(AUTH_LIST)
      .then((storage) => storage[AUTH_LIST])
      .then((list) => JSON.parse(list || '{}'))
  }

  public async setAccounts(accounts: Account[]): Promise<void> {
    if (import.meta.env.DEV) return Promise.resolve()

    await chrome.storage.sync.set({ [ACCOUNTS]: JSON.stringify(accounts) })
    return sendMessageToContent('NOTIFY_ACCOUNTS_CHANGED')
  }

  public async setAuthList(authList: AuthList): Promise<void> {
    if (import.meta.env.DEV) return Promise.resolve()

    await chrome.storage.sync.set({ [AUTH_LIST]: JSON.stringify(authList) })
    return sendMessageToContent('NOTIFY_AUTH_LIST_CHANGED')
  }
}

export const storage = new Storage()
