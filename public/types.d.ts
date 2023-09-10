import type { TF_WALLET_CONNECTOR_EXTENSION_CMDS } from '../src/global-components'

export type Commands = keyof TF_WALLET_CONNECTOR_EXTENSION_CMDS

export interface Message {
  extension: 'TF_WALLET_CONNECTOR_EXTENSION'
  event: Commands
  data?: null | any
}

export interface HandlerCtx {
  message: null | any
  sender: chrome.runtime.MessageSender
  sendResponse: (response?: any) => void
}

export interface Account {
  name: string
  mnemonic: string
  twinId: number
  address: string
  visible: boolean
  networks: string[]
}
export interface PublicAccount {
  name: string
  mnemonic: string
  encryptedMnemonic: boolean
  address: string
  networks: string[]
  metadata: { [network: string]: { twinId: number | null; ssh: string | null } }
}
