import type { Network, PublicAccount } from '@/types'
import { BackendStorageType, GridClient, NetworkEnv } from '@threefold/grid_client'

export async function loadGrid(
  mnemonic: string,
  network: string = NetworkEnv.dev,
  times: number = 3
): Promise<GridClient> {
  try {
    const grid = new GridClient({
      mnemonic,
      network: network as NetworkEnv,
      storeSecret: mnemonic,
      backendStorageType: BackendStorageType.tfkvstore
    })
    await grid.connect()
    return grid
  } catch (error) {
    if (!times || times <= 0) throw error
    return loadGrid(mnemonic, network, times - 1)
  }
}

export function getBestNetwork(networks: string[]): string {
  if (networks.includes('main')) return 'main'
  if (networks.includes('test')) return 'test'
  if (networks.includes('qa')) return 'qa'
  return 'dev'
}

export function createAccount(network: string = NetworkEnv.dev) {
  const grid = new GridClient({
    network: network as NetworkEnv,
    mnemonic: '',
    storeSecret: 'test'
  })
  grid._connect()
  const relay = grid.getDefaultUrls(network as NetworkEnv).relay.slice(6)
  return grid.tfchain.createAccount(relay)
}

export function activateAccountAndCreateTwin(mnemonic: string, network: string = NetworkEnv.dev) {
  const grid = new GridClient({
    network: network as NetworkEnv,
    mnemonic,
    storeSecret: mnemonic
  })
  grid._connect()
  const relay = grid.getDefaultUrls(network as NetworkEnv).relay.slice(6)
  return grid.tfchain.activateAccountAndCreateTwin(mnemonic, relay, true)
}

export async function getMetadata(grid: GridClient): Promise<{ [key: string]: any }> {
  try {
    const metadata = await grid.kvstore.get({ key: 'metadata' })
    return JSON.parse(metadata)
  } catch {
    return {}
  }
}

export async function readSSH(grid: GridClient): Promise<string> {
  const metadata = await getMetadata(grid)
  return metadata.sshkey || ''
}

export async function storeSSH(grid: GridClient, newSSH: string): Promise<void> {
  const metadata = await getMetadata(grid)
  const ssh = metadata.sshkey
  if (ssh === newSSH) return

  return grid.kvstore.set({
    key: 'metadata',
    value: JSON.stringify({
      ...metadata,
      sshkey: newSSH
    })
  })
}

export function joinedNetwork(mnemonic: string, network: string) {
  async function _joinedNetwork(times: number): Promise<boolean> {
    try {
      const grid = await loadGrid(mnemonic, network)
      await grid.disconnect()
      return true
    } catch (error) {
      console.log('[joinedNetwork]', network, error)

      if (
        (error as Error).message
          .toLowerCase()
          .includes("couldn't find a user for the provided mnemonic")
      )
        return false
      if (times < 3) return _joinedNetwork(times + 1)
      return false
    }
  }

  return _joinedNetwork(0)
}

function joinNetwork(mnemonic: string, network: string) {
  async function _joinNetwork(times: number): Promise<boolean> {
    try {
      await activateAccountAndCreateTwin(mnemonic, network)
      return true
    } catch (error) {
      console.log('[joinNetwork]', error)

      if (times < 3) return _joinNetwork(times + 1)
      return false
    }
  }

  return _joinNetwork(0)
}

export async function checkAndCreateTwin(mnemonic: string, network: string): Promise<boolean> {
  if (await joinedNetwork(mnemonic, network)) {
    return true
  }

  return joinNetwork(mnemonic, network)
}

export interface LoadPublicAccountOptions {
  name: string
  address: string
  mnemonic: string
  networks: string[]
  encryptedMnemonic: boolean
  keypairType: string
}
export async function loadPublicAccount(options: LoadPublicAccountOptions): Promise<PublicAccount> {
  async function _loadAccountMetadata(): Promise<PublicAccount['metadata']> {
    const metadata: PublicAccount['metadata'] = {}

    if (options.encryptedMnemonic) {
      return metadata
    }

    const networksMetadata = await Promise.all(
      options.networks.map(async (network) => {
        const grid = await loadGrid(options.mnemonic, network, 3).catch((error) => {
          console.log(error)
          return null
        })
        if (!grid) return { twinId: null, ssh: null }
        const metadata = { twinId: grid.twinId, ssh: await readSSH(grid).catch(() => null) }
        await grid.disconnect()
        return metadata
      })
    )

    return options.networks.reduce((res, network, index) => {
      res[network as Network] = networksMetadata[index]
      return res
    }, metadata)
  }

  return {
    name: options.name,
    address: options.address,
    mnemonic: options.mnemonic,
    encryptedMnemonic: options.encryptedMnemonic,
    networks: options.networks as Network[],
    metadata: await _loadAccountMetadata(),
    keypairType: options.keypairType
  }
}
