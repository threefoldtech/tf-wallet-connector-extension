import type { BusEvents } from './busEvents'

export type NetworkOptions = string | string[]
export type KeypairType = 'sr25519' | 'ed25519'

export interface SignReturn {
  publicKey: string
  signature: string
}

export interface SignOptions {
  content: string
  mnemonic: string
  keypairType: KeypairType
}

export interface RuntimeContext<T> {
  message: T
  error?: string
  sender: chrome.runtime.MessageSender
  sendResponse: (response?: any) => void
}

export type RuntimeHandler<T = unknown> = (ctx: RuntimeContext<T>) => void
export type InjectHandler<T = unknown> = (message: T, error?: string) => void

export type HandlerSet<T> = { [event in BusEvents]?: T[] }

export interface Message {
  extension: 'TF_WALLET_CONNECTOR_EXTENSION'
  event: BusEvents
  data?: any
  error?: string
}

export interface ListenerOptions {
  once?: boolean
}

export type Unsubscribe = () => void

export interface PublicAccount {
  name: string
  mnemonic: string
  address: string
  encryptedMnemonic: boolean
  metadata: { [network: string]: { twinId: string | null; ssh: string | null } }
  networks: string[]
  keypairType: string
}

export interface AuthList {
  [url: string]: boolean
}
