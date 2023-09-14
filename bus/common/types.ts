import { BusEvents } from './busEvents'

export interface RuntimeContext<T> {
  message?: T
  error?: string
  sender: chrome.runtime.MessageSender
  sendResponse: (response?: any) => void
}

export type RuntimeHandler<T = unknown> = (ctx: RuntimeContext<T>) => void
export type InjectHandler<T = unknown> = (message?: T, error?: string) => void

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
}

export interface AuthList {
  [url: string]: boolean
}
