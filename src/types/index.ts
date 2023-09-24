export type Network = 'dev' | 'test' | 'qa' | 'main'

export interface PublicAccount {
  name: string
  mnemonic: string
  encryptedMnemonic: boolean
  address: string
  networks: Network[]
  metadata: { [key in Network]?: { twinId: number | null; ssh: string | null } }
  keypairType: string
}

export type Account = PublicAccount

export type AuthList = { [url: string]: boolean }
