export type Network = 'dev' | 'test' | 'qa' | 'main'

export interface Account {
  name: string
  mnemonic: string
  address: string
  ssh?: string
  visible: boolean
  networks: Network[]
}

export type AuthList = { [url: string]: boolean }
