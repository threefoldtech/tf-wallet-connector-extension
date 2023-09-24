export type Network = 'dev' | 'test' | 'qa' | 'main'

export interface Account {
  name: string
  mnemonic: string
  address: string
  ssh?: string
  visible: boolean
  keypairType: string
  networks: Network[]
}

export interface PublicAccount {
  name: string
  mnemonic: string
  encryptedMnemonic: boolean
  address: string
  networks: Network[]
  metadata: { [key in Network]?: { twinId: number | null; ssh: string | null } }
}

export type AuthList = { [url: string]: boolean }
