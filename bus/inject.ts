import { BusHandler, ContentRuntime, FileType } from './common'
import type { PublicAccount, NetworkOptions, KeypairType, SignReturn } from './common/types'

class InjectHandler extends BusHandler {
  public constructor() {
    super(FileType.Inject)

    this.listenToContent(ContentRuntime.browser)
  }

  public hasAccess(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      this.addContentEventListener('HAS_ACCESS', (msg) => res(!!msg), { once: true })
      this.sendToContent({ event: 'HAS_ACCESS' })
    })
  }

  public requestAccess(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      this.addContentEventListener('REQUEST_ACCESS', (msg) => res(!!msg), { once: true })
      this.sendToContent({ event: 'REQUEST_ACCESS' })
    })
  }

  public getPublicAccounts(network?: NetworkOptions): Promise<PublicAccount[]> {
    return new Promise((res, rej) => {
      this.addContentEventListener<true, PublicAccount[]>(
        'GET_PUBLIC_ACCOUNTS',
        (accounts, err) => {
          if (err) return rej(err)
          res(accounts)
        },
        { once: true }
      )
      this.sendToContent({ event: 'GET_PUBLIC_ACCOUNTS', data: network })
    })
  }

  public listenToPublicAccounts() {} /* LISTEN_PUBLIC_ACCOUNTS */

  public selectAccount(): Promise<PublicAccount | null> {
    return new Promise((res, rej) => {
      this.addContentEventListener<true, PublicAccount | null>(
        'SELECT_ACCOUNT',
        (account, err) => {
          if (err) return rej(err)
          res(account)
        },
        { once: true }
      )
      this.sendToContent({ event: 'SELECT_ACCOUNT' })
    })
  }

  public requestDecryptedAccount(
    mnemonic: string,
    network?: NetworkOptions
  ): Promise<PublicAccount | null> {
    return new Promise((res, rej) => {
      this.addContentEventListener<true, PublicAccount | null>(
        'REQUEST_DECRYPTED_ACCOUNT',
        (account, err) => {
          if (err) return rej(err)
          res(account)
        },
        { once: true }
      )
      this.sendToContent({ event: 'REQUEST_DECRYPTED_ACCOUNT', data: { mnemonic, network } })
    })
  }

  public selectDecryptedAccount(network?: NetworkOptions): Promise<PublicAccount | null> {
    return new Promise((res, rej) => {
      this.addContentEventListener<true, PublicAccount | null>(
        'SELECT_DECRYPTED_ACCOUNT',
        (account, err) => {
          if (err) return rej(err)
          res(account)
        },
        { once: true }
      )
      this.sendToContent({ event: 'SELECT_DECRYPTED_ACCOUNT', data: network })
    })
  }

  public getAuthList() {
    return new Promise((res) => {})
  }
  public listenToAuthList() {} /* LISTEN_AUTH_LIST */

  public sign(
    content: string,
    mnemonic: string,
    keypairType: KeypairType
  ): Promise<SignReturn | null> {
    return new Promise((res, rej) => {
      this.addContentEventListener<true, SignReturn | null>(
        'SIGN_CONTENT',
        (sign, err) => {
          if (err) return rej(err)
          return res(sign)
        },
        { once: true }
      )
      this.sendToContent({ event: 'SIGN_CONTENT', data: { content, mnemonic, keypairType } })
    })
  }
}

window['TF_WALLET_CONNECTOR_EXTENSION_HANDLER'] = new InjectHandler()
