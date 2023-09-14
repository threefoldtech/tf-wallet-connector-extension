import { BusHandler, ContentRuntime, FileType } from './common'
import { PublicAccount } from './common/types'

class InjectHandler extends BusHandler {
  public constructor() {
    super(FileType.Inject)

    this.listenToContent(ContentRuntime.browser)
  }

  public hasAccess(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      this.addContentEventListener('HAS_ACCESS', (msg) => res(!!msg), { once: true })
      this.sendToContent('FORWARD_MESSAGE_BUS', { event: 'HAS_ACCESS' })
    })
  }

  public requestAccess(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      this.addContentEventListener('REQUEST_ACCESS', (msg) => res(!!msg), { once: true })
      this.sendToContent('FORWARD_MESSAGE_BUS', { event: 'REQUEST_ACCESS' })
    })
  }

  public selectAccount(): Promise<PublicAccount | null> {
    return new Promise((res, rej) => {
      this.addContentEventListener<true, PublicAccount | null>(
        'SELECT_ACCOUNT',
        (account, err) => {
          if (err) return rej(new Error(err))
          res(account || null)
        },
        { once: true }
      )
      this.sendToContent('FORWARD_MESSAGE_BUS', { event: 'SELECT_ACCOUNT' })
    })
  }
}

window['TF_WALLET_CONNECTOR_EXTENSION_HANDLER'] = new InjectHandler()
