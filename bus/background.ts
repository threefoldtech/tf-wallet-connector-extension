import { BusHandler, ContentRuntime, FileType } from './common'
import type { PublicAccount, AuthList } from './common/types'

enum StorageKey {
  Accounts = 'TF_WALLET_CONNECTOR_EXTENSION_ACCOUNTS',
  AuthList = 'TF_WALLET_CONNECTOR_EXTENSION_AUTH_LIST'
}

async function readAccounts(): Promise<PublicAccount[]> {
  const storage = await chrome.storage.sync.get(StorageKey.Accounts)
  return JSON.parse(storage[StorageKey.Accounts] || '[]')
}

async function readAuthList(): Promise<AuthList> {
  const storage = await chrome.storage.sync.get(StorageKey.AuthList)
  return JSON.parse(storage[StorageKey.AuthList] || '{}')
}

async function hasAccess(url?: string): Promise<boolean> {
  const authList = await readAuthList()
  return authList[url || ''] || false
}

function accessError(str: string): string {
  return `Please request access permission before trying to ${str}.`
}

interface CreateWindowOptions {
  base?: string
  params: string[]
  query: { [key: string]: any }
}

async function createWindow(options: CreateWindowOptions) {
  const base = options.base || chrome.runtime.getURL('index.html')
  const params = options.params.join('/')
  const query = Object.entries(options.query)
    .map((e) => e.join('='))
    .join('&')

  const url = `${base}#/${params}?${query}`
  return chrome.windows.create({
    url,
    height: 600,
    width: 535,
    top: 50,
    left: 50,
    focused: true,
    type: 'popup'
  })
}

class BackgroundHandler extends BusHandler {
  public constructor() {
    super(FileType.Background)

    this.listenToContent(ContentRuntime.extension)
  }
}

const backgroundHandler = new BackgroundHandler()

backgroundHandler.addContentEventListener<false>('HAS_ACCESS', async ({ sender }) => {
  backgroundHandler.sendToContent('FORWARD_MESSAGE_BUS', {
    event: 'HAS_ACCESS',
    data: await hasAccess(sender.origin)
  })
})

backgroundHandler.addContentEventListener<false>('REQUEST_ACCESS', async ({ sender }) => {
  const gotAccess = await hasAccess(sender.origin)
  if (gotAccess || !sender.tab?.id) {
    return await backgroundHandler.sendToContent('FORWARD_MESSAGE_BUS', {
      event: 'REQUEST_ACCESS',
      data: gotAccess
    })
  }

  await createWindow({
    params: ['request-access'],
    query: {
      url: sender.origin,
      tabId: sender.tab!.id
    }
  })
})

backgroundHandler.addContentEventListener<false, string[]>(
  'SELECT_ACCOUNT',
  async ({ message, sender }) => {
    const gotAccess = await hasAccess(sender.origin)
    if (!gotAccess) {
      return await backgroundHandler.sendToContent('FORWARD_MESSAGE_BUS', {
        event: 'SELECT_ACCOUNT',
        error: accessError('select an account')
      })
    }

    await createWindow({
      params: ['select-decrypted-account', message ? message.join('-') : 'none'],
      query: { url: sender.origin, tabId: sender.tab?.id, decrypted: false }
    })
  }
)
