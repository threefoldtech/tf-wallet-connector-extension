import { BackendStorageType, GridClient, NetworkEnv } from '@threefold/grid_client'

export async function loadGrid(mnemonic: string): Promise<GridClient> {
  const grid = new GridClient({
    mnemonic,
    network: NetworkEnv.dev,
    storeSecret: mnemonic,
    backendStorageType: BackendStorageType.tfkvstore
  })
  await grid.connect()
  return grid
}
