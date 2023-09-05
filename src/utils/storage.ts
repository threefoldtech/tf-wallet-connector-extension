import type { Account, AuthList } from '@/types'
import { sendMessageToContent } from '.'

const ACCOUNTS = window.$TF_WALLET_CONNECTOR_EXTENSION + '_ACCOUNTS'
const AUTH_LIST = window.$TF_WALLET_CONNECTOR_EXTENSION + '_AUTH_LIST'

class Storage {
  public get accounts(): Promise<Account[]> {
    return chrome.storage.sync
      .get(ACCOUNTS)
      .then((storage) => storage[ACCOUNTS])
      .then((accounts) => JSON.parse(accounts || '[]'))
  }

  public get authList(): Promise<AuthList> {
    return chrome.storage.sync
      .get(AUTH_LIST)
      .then((storage) => storage[AUTH_LIST])
      .then((list) => JSON.parse(list || '{}'))
  }

  public async setAccounts(accounts: Account[]): Promise<void> {
    await chrome.storage.sync.set({ [ACCOUNTS]: JSON.stringify(accounts) })
    return sendMessageToContent('LISTEN_PUBLIC_ACCOUNTS')
  }

  public async setAuthList(authList: AuthList): Promise<void> {
    await chrome.storage.sync.set({ [AUTH_LIST]: JSON.stringify(authList) })
    return sendMessageToContent('LISTEN_AUTH_LIST')
  }
}

export const storage = new Storage()
