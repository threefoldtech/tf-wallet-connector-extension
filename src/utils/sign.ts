import type { SignReturn } from '@/global-components'
import { Keyring } from '@polkadot/keyring'
import { waitReady } from '@polkadot/wasm-crypto'
import { Buffer } from 'buffer'
import md5 from 'md5'

export enum KeypairType {
  sr25519 = 'sr25519',
  ed25519 = 'ed25519'
}

export interface SignOptions {
  content: string
  mnemonic: string
  keypairType: KeypairType
}

export async function sign(options: SignOptions): Promise<SignReturn> {
  const ready = await waitReady()
  if (!ready) {
    throw new Error('Failed to awaitReady `@polkadot/wasm-crypto`.')
  }

  const hash = md5(options.content)
  const messageBytes = Uint8Array.from(Buffer.from(hash, 'hex'))
  const keyr = new Keyring({ type: options.keypairType })

  const key = keyr.addFromMnemonic(options.mnemonic)
  const signed = key.sign(messageBytes)

  return {
    signature: Buffer.from(signed).toString('hex'),
    publicKey: key.address
  }
}
