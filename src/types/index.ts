export type Network = 'dev' | 'test' | 'qa' | 'main'

export interface Account {
  name: string
  mnemonic: string
  twinId: number
  address: string
  ssh: string
  relay: string
  visible: boolean
  networks: Network[]
}

export type AuthList = { [url: string]: boolean }
