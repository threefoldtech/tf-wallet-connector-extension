import type {
  KeypairType,
  NetworkOptions,
  PublicAccount,
  SignReturn,
  Unsubscribe
} from '../bus/common/types'

const key = 'TF_WALLET_CONNECTOR_EXTENSION_HANDLER'

export class ThreefoldWalletConnectorApi {
  private static get handler(): any {
    return window[key]
  }

  public static isInstalledSync(): boolean {
    return key in window
  }

  public static isInstalled(): boolean | Promise<boolean> {
    if (document.readyState === 'complete') {
      return this.isInstalledSync()
    }

    return new Promise<boolean>((res) => {
      window.addEventListener('load', res.bind(this, this.isInstalledSync()), { once: true })
    })
  }

  public static hasAccess(): Promise<boolean> {
    return ThreefoldWalletConnectorApi.handler.hasAccess()
  }

  public static requestAccess(): Promise<boolean> {
    return ThreefoldWalletConnectorApi.handler.requestAccess()
  }

  public static selectAccount(network?: NetworkOptions): Promise<PublicAccount | null> {
    return ThreefoldWalletConnectorApi.handler.selectAccount(network)
  }

  public static requestDecryptedAccount(
    mnemonic: string,
    network?: NetworkOptions
  ): Promise<PublicAccount | null> {
    return ThreefoldWalletConnectorApi.handler.requestDecryptedAccount(mnemonic, network)
  }

  public static getPublicAccounts(network?: NetworkOptions): Promise<PublicAccount[]> {
    return ThreefoldWalletConnectorApi.handler.getPublicAccounts(network)
  }

  public static listenToPublicAccounts(
    handler: (accounts: PublicAccount[]) => void,
    network?: NetworkOptions
  ): Unsubscribe {
    return ThreefoldWalletConnectorApi.handler.subscribeAccounts(handler, network)
  }

  public static selectDecryptedAccount(network?: NetworkOptions): Promise<PublicAccount | null> {
    return ThreefoldWalletConnectorApi.handler.selectDecryptedAccount(network)
  }

  public static sign(
    content: string,
    mnemonic: string,
    keypairType: KeypairType
  ): Promise<SignReturn | null> {
    return ThreefoldWalletConnectorApi.handler.sign(content, mnemonic, keypairType)
  }
}

export type { KeypairType, NetworkOptions, PublicAccount, SignReturn, Unsubscribe }
