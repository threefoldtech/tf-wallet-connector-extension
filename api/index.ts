const TF_WALLET_CONNECTOR_EXTENSION = 'TF_WALLET_CONNECTOR_EXTENSION'
const EXTENSION_HANDLER = TF_WALLET_CONNECTOR_EXTENSION + '_HANDLER'

export interface Account {
  name: string
  mnemonic: string
  address: string
  relay: string
  ssh: string
  twinId: number
  visible: boolean
}

export interface PublicAccount {
  name: string
  mnemonic: string
  address: string
  encryptedMnemonic: boolean
  metadata: { [network: string]: { twinId: string | null; ssh: string | null } }
  networks: string[]
}

export interface SignReturn {
  publicKey: string
  signature: string
}

// prettier-ignore
export class ThreefoldWalletConnectorApi {
  public static isInstalledSync(): boolean {
    if (document.readyState !== "complete") {
      ThreefoldWalletConnectorApi._log(
        "[isInstalledSync(warn)]",
        "Document is not ready yet which might lead to unexpected results."
      )
    }
    return EXTENSION_HANDLER in window
  }

  public static isInstalled(): Promise<boolean> {
    if (document.readyState === "complete") {
      return Promise.resolve(ThreefoldWalletConnectorApi.isInstalledSync())
    }
    return new Promise<boolean>((res) => {
      window.addEventListener(
        "load",
        () => {
          res(ThreefoldWalletConnectorApi.isInstalledSync())
        },
        { once: true }
      )
    })
  }

  public static hasAccess(): Promise<boolean> {
    return ThreefoldWalletConnectorApi
      ._installGuard("hasAccess")
      ._api
      .hasAccess()
  }

  public static requestAccess(): Promise<boolean> {
    return ThreefoldWalletConnectorApi
      ._installGuard("requestAccess")
      ._api
      .requestAccess()
  }

  public static selectAccount(networks?: string | string[]): Promise<PublicAccount | null> {
    return ThreefoldWalletConnectorApi
      ._installGuard('selectAccount')
      ._api
      .selectAccount(networks)
  }

  public static requestDecryptedAccount(decryptedMnemonic: string, networks?: string | string[]): Promise<string | null> {
    return ThreefoldWalletConnectorApi
      ._installGuard("requestDecryptedAccount")
      ._api
      .requestDecryptedAccount(decryptedMnemonic, networks)
  }

  public static getPublicAccounts(networks?: string | string[]): Promise<Account[]> {
    return ThreefoldWalletConnectorApi
      ._installGuard("getPublicAccounts")
      ._api
      .getPublicAccounts(networks)
  }

  public static listenToPublicAccounts(listener: (accounts: Account[]) => void): () => void {
    return ThreefoldWalletConnectorApi
      ._installGuard("listenToPublicAccounts")
      ._api
      .listenToPublicAccounts(listener)
  }

  public static selectDecryptedAccount(networks?:  string | string[]): Promise<PublicAccount | null> {
    return ThreefoldWalletConnectorApi
      ._installGuard("selectDecryptedAccount")
      ._api
      .selectDecryptedAccount(networks)
  }

  public static sign(content: string, mnemonic: string, keypairType: 'sr25519' | 'ed25519'): Promise<SignReturn | null> {
    return ThreefoldWalletConnectorApi
      ._installGuard("sign")
      ._api
      .sign(content, mnemonic, keypairType)
  }

  private static get _api() {
    return (window as any)[EXTENSION_HANDLER]
  }

  private static _installGuard(method: string) {
    if (!ThreefoldWalletConnectorApi.isInstalledSync()) {
      throw new Error(
        `[${TF_WALLET_CONNECTOR_EXTENSION}] [${method}(error)] Threefold wallet connector extension is not installed yet.`
      )
    }
    return ThreefoldWalletConnectorApi
  }

  private static _log(...args: string[]) {
    console.log(`[${TF_WALLET_CONNECTOR_EXTENSION}]`, ...args)
  }
}
