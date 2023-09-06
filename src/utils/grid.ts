import { BackendStorageType, GridClient, NetworkEnv } from '@threefold/grid_client'

export async function loadGrid(
  mnemonic: string,
  network: string = NetworkEnv.dev
): Promise<GridClient> {
  const grid = new GridClient({
    mnemonic,
    network: network as NetworkEnv,
    storeSecret: mnemonic,
    backendStorageType: BackendStorageType.tfkvstore
  })
  await grid.connect()
  return grid
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
  const metadata = await grid.kvstore.get({ key: 'metadata' })
  try {
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

function joinedNetwork(mnemonic: string, network: string) {
  async function _joinedNetwork(times: number): Promise<boolean> {
    try {
      const grid = await loadGrid(mnemonic, network)
      await grid.disconnect()
      return true
    } catch (error) {
      console.log('[joinedNetwork]', error)

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
