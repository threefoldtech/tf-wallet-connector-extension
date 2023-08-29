import { BackendStorageType, GridClient, NetworkEnv } from '@threefold/grid_client'

export const network = NetworkEnv.dev

export async function loadGrid(mnemonic: string): Promise<GridClient> {
  const grid = new GridClient({
    mnemonic,
    network,
    storeSecret: mnemonic,
    backendStorageType: BackendStorageType.tfkvstore
  })
  await grid.connect()
  return grid
}

export function createAccount() {
  const grid = new GridClient({
    network,
    mnemonic: '',
    storeSecret: 'test'
  })
  grid._connect()
  const relay = grid.getDefaultUrls(network).relay.slice(6)
  return grid.tfchain.createAccount(relay)
}

export function activateAccountAndCreateTwin(mnemonic: string) {
  const grid = new GridClient({
    network,
    mnemonic,
    storeSecret: mnemonic
  })
  grid._connect()
  const relay = grid.getDefaultUrls(network).relay.slice(6)
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
