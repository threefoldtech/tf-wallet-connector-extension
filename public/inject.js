// @ts-check

{
  /** @type { import("../src/global-components") } */
  /** @typedef { import("./types").Message } Message */
  /** @typedef { import("./types").Commands } Commands */
  /** @typedef { import("./types").Account } Account */

  class InjectHandler {
    /** @type { {[key: string]: (data?: Message['data']) => void }} */ _handlers = {}

    constructor() {
      document.addEventListener(
        window.$TF_WALLET_CONNECTOR_EXTENSION,
        this._messageHandler.bind(this)
      )
    }

    /**
     * @param { Commands } event
     * @param { (data?: Message['data']) => void } handler
     * @param { boolean } [once]
     */
    on(event, handler, once) {
      if (once) {
        this._handlers[event] = (...args) => {
          delete this._handlers[event]
          handler(...args)
        }
        return
      }
      this._handlers[event] = handler
    }

    /**
     * @param { Commands } event
     * @param { undefined | Message['data'] } [data]
     */
    async sendMessageToContent(event, data) {
      /** @type { Message } */ const msg = {
        extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
        event,
        data
      }
      if (event !== 'HAS_ACCESS' && event !== 'REQUEST_ACCESS' && !(await this.hasAccess())) {
        throw new Error('Please make sure to get access permission before continue.')
      }

      window.postMessage(msg)
    }

    /**
     *
     * @param { CustomEvent<Message> } event
     */
    _messageHandler({ detail: message }) {
      if (
        typeof message === 'object' &&
        'extension' in message &&
        message.extension === window.$TF_WALLET_CONNECTOR_EXTENSION
      ) {
        if (message.event in this._handlers) {
          return this._handlers[message.event](message.data)
        }
        console.log(`[TF_WALLET_CONNECTOR_EXTENSION] Unsupported event ${message.event}.`)
      }
    }

    /** @param { string } mnemonic  */
    async requestDecryptedAccount(mnemonic) {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.on('REQUEST_DECRYPTED_ACCOUNT', res, true)
        this.sendMessageToContent('REQUEST_DECRYPTED_ACCOUNT', mnemonic)
      })
    }

    /** @returns { Promise<boolean> } */
    async hasAccess() {
      return new Promise((res) => {
        this.on('HAS_ACCESS', res, true)
        this.sendMessageToContent('HAS_ACCESS')
      })
    }

    /** @returns { Promise<boolean> } */
    async requestAccess() {
      return new Promise((res) => {
        this.on('RESPONSE_ACCESS', res, true)
        this.sendMessageToContent('REQUEST_ACCESS')
      })
    }

    /** @returns { Promise<Account[]> } */
    async getPublicAccounts() {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.on('GET_PUBLIC_ACCOUNTS', res, true)
        this.sendMessageToContent('GET_PUBLIC_ACCOUNTS')
      })
    }

    /**
     *
     * @param { (accounts: Account[], error?: Error) => void } callback
     * @returns { () => void }
     */
    listenToPublicAccounts(callback) {
      let _done = false
      this._hasAccessGuard()
        .then(() => {
          const _listenToPublicAccounts = () => {
            this.on(
              'GET_PUBLIC_ACCOUNTS',
              (accounts) => {
                if (!_done) {
                  callback(accounts)
                  _listenToPublicAccounts()
                }
              },
              true
            )
          }

          _listenToPublicAccounts()
          this.sendMessageToContent('LISTEN_PUBLIC_ACCOUNTS')
        })
        .catch((error) => {
          _done = true
          callback([], error)
        })

      return () => {
        if (!_done) {
          _done = true
          this.sendMessageToContent('STOP_LISTEN_PUBLIC_ACCOUNTS')
        }
      }
    }

    async _hasAccessGuard() {
      if (await this.hasAccess()) {
        return
      }

      throw new Error('Please make sure to get access permission before continue.')
    }
  }

  window[window.$TF_WALLET_CONNECTOR_EXTENSION + '_HANDLER'] = new InjectHandler()
}
