import type {
  AuthList,
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

  public static async isInstalled(): Promise<boolean> {
    const installed = ThreefoldWalletConnectorApi.isInstalledSync()

    if (
      document.readyState === 'complete' ||
      (document.readyState === 'interactive' && installed)
    ) {
      return installed
    }

    await ThreefoldWalletConnectorApi._readyStateChange()
    return ThreefoldWalletConnectorApi.isInstalled()
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
    handler: (accounts: PublicAccount[], error?: string) => void,
    network?: NetworkOptions
  ): Unsubscribe {
    return ThreefoldWalletConnectorApi.handler.subscribeAccounts(handler, network)
  }

  public static getAuthList(): Promise<AuthList> {
    return ThreefoldWalletConnectorApi.handler.getAuthList()
  }

  public static listenToAuthList(handler: (list: AuthList) => void): Unsubscribe {
    return ThreefoldWalletConnectorApi.handler.subscribeAuthList(handler)
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

  private static _readyStateChange(): Promise<void> {
    return new Promise((res) => {
      if (document.readyState === 'complete') {
        return res()
      }

      document.addEventListener('readystatechange', () => res(), { once: true })
    })
  }
}

export { KeypairType, NetworkOptions, PublicAccount, SignReturn, Unsubscribe, AuthList }
