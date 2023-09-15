import { Keyring } from '@polkadot/keyring'
import { waitReady } from '@polkadot/wasm-crypto'
import { Buffer } from 'buffer'
import md5 from 'md5'

import { BusHandler, ContentRuntime, FileType } from './common'
import type {
  PublicAccount,
  AuthList,
  NetworkOptions,
  SignOptions,
  SignReturn
} from './common/types'

enum StorageKey {
  Accounts = 'TF_WALLET_CONNECTOR_EXTENSION_ACCOUNTS',
  AuthList = 'TF_WALLET_CONNECTOR_EXTENSION_AUTH_LIST'
}

type Account = PublicAccount & { visible: boolean }

async function readAccounts(): Promise<Account[]> {
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

function normalizeNetwork(maybeNetwork?: NetworkOptions): string[] | null {
  return typeof maybeNetwork === 'string'
    ? [maybeNetwork]
    : Array.isArray(maybeNetwork)
    ? maybeNetwork
    : null
}

async function sign(options: SignOptions): Promise<SignReturn | null> {
  const ready = await waitReady()
  if (!ready) {
    return null
  }

  const hash = md5(options.content)
  const messageBytes = Uint8Array.from(Buffer.from(hash, 'hex'))
  const keyr = new Keyring({ type: options.keypairType })

  const key = keyr.addFromMnemonic(options.mnemonic)
  const signed = key.sign(messageBytes)

  return {
    signature: Buffer.from(signed).toString('hex'),
    publicKey: key.address
  }
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
  backgroundHandler.sendToContent({
    event: 'HAS_ACCESS',
    data: await hasAccess(sender.origin)
  })
})

backgroundHandler.addContentEventListener<false>('REQUEST_ACCESS', async ({ sender }) => {
  const gotAccess = await hasAccess(sender.origin)
  if (gotAccess) {
    return await backgroundHandler.sendToContent({
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

backgroundHandler.addContentEventListener<false, NetworkOptions>(
  'GET_PUBLIC_ACCOUNTS',
  async ({ message: network, sender }) => {
    const gotAccess = await hasAccess(sender.origin)
    if (!gotAccess) {
      return await backgroundHandler.sendToContent({
        event: 'GET_PUBLIC_ACCOUNTS',
        error: accessError('get public accounts')
      })
    }

    const allAccounts = await readAccounts()
    let accounts = allAccounts.filter((account) => account.visible)

    const networks = normalizeNetwork(network)
    if (networks) {
      accounts = accounts.filter((account) => {
        return networks.some((network) => account.networks.includes(network))
      })
    }

    await backgroundHandler.sendToContent({
      event: 'GET_PUBLIC_ACCOUNTS',
      data: accounts
    })
  }
)

backgroundHandler.addContentEventListener<false, NetworkOptions>(
  'SELECT_ACCOUNT',
  async ({ message: network, sender }) => {
    const gotAccess = await hasAccess(sender.origin)
    if (!gotAccess) {
      return await backgroundHandler.sendToContent({
        event: 'SELECT_ACCOUNT',
        error: accessError('select an account')
      })
    }

    const networks = normalizeNetwork(network)

    await createWindow({
      params: ['select-decrypted-account', networks ? networks.join('-') : 'none'],
      query: { url: sender.origin, tabId: sender.tab?.id, decrypted: false }
    })
  }
)

backgroundHandler.addContentEventListener<false, { mnemonic: string; network?: NetworkOptions }>(
  'REQUEST_DECRYPTED_ACCOUNT',
  async ({ message, sender }) => {
    const gotAccess = await hasAccess(sender.origin)
    if (!gotAccess) {
      return await backgroundHandler.sendToContent({
        event: 'REQUEST_DECRYPTED_ACCOUNT',
        error: accessError('request to decrypt an account')
      })
    }

    const networks = normalizeNetwork(message.network)
    await createWindow({
      params: [
        'request-decrypted-account',
        message.mnemonic,
        networks ? networks.join('-') : 'none'
      ],
      query: { url: sender.origin, tabId: sender.tab?.id }
    })
  }
)

backgroundHandler.addContentEventListener<false, NetworkOptions>(
  'SELECT_DECRYPTED_ACCOUNT',
  async ({ message, sender }) => {
    const gotAccess = await hasAccess(sender.origin)
    if (!gotAccess) {
      return await backgroundHandler.sendToContent({
        event: 'SELECT_DECRYPTED_ACCOUNT',
        error: accessError('select a decrypted account')
      })
    }

    const networks = normalizeNetwork(message)

    await createWindow({
      params: ['select-decrypted-account', networks ? networks.join('-') : 'none'],
      query: { url: sender.origin, tabId: sender.tab?.id }
    })
  }
)

backgroundHandler.addContentEventListener<false, SignOptions>(
  'SIGN_CONTENT',
  async ({ message, sender }) => {
    const gotAccess = await hasAccess(sender.origin)
    if (!gotAccess) {
      return await backgroundHandler.sendToContent({
        event: 'SIGN_CONTENT',
        error: accessError('sign your content')
      })
    }

    try {
      await backgroundHandler.sendToContent({
        event: 'SIGN_CONTENT',
        data: await sign(message)
      })
    } catch {
      return await backgroundHandler.sendToContent({
        event: 'SIGN_CONTENT',
        error: 'Failed to sign your content.'
      })
    }
  }
)

backgroundHandler.addContentEventListener<false>('GET_AUTH_LIST', async () => {
  await backgroundHandler.sendToContent({
    event: 'GET_AUTH_LIST',
    data: await readAuthList()
  })
})
