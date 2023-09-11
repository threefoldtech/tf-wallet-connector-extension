// @ts-check

{
  /** @type { import("../src/global-components") } */
  /** @typedef { import("./types").Message } Message */
  /** @typedef { import("./types").Commands } Commands */
  /** @typedef { import("./types").Account } Account */
  /** @typedef { import('../src/global-components').SignReturn} SignReturn */

  class InjectHandler {
    /** @type { {[key: string]: ((data?: Message['data']) => void)[] }} */ _handlers = {}

    constructor() {
      document.addEventListener(
        window.$TF_WALLET_CONNECTOR_EXTENSION,
        this._messageHandler.bind(this)
      )
    }

    /**
     * @param { Commands } event
     * @param { (data?: Message['data']) => void } handler
     */
    once(event, handler) {
      if (!Array.isArray(this._handlers[event])) {
        this._handlers[event] = []
      }

      this._handlers[event].push(handler)
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
          const handlers = this._handlers[message.event]
          if (handlers && handlers.length) {
            const [fn] = handlers.splice(0, 1)
            return fn(message.data)
          }
        }
        console.log(`[TF_WALLET_CONNECTOR_EXTENSION] Unsupported event ${message.event}.`)
      }
    }

    /**
     * @param { string } mnemonic
     * @param { string | string[] } [networks]
     */
    async requestDecryptedAccount(mnemonic, networks) {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.once('REQUEST_DECRYPTED_ACCOUNT', res)
        this.sendMessageToContent('REQUEST_DECRYPTED_ACCOUNT', {
          mnemonic,
          networks: this._normalizeNetworks(networks)
        })
      })
    }

    /** @returns { Promise<boolean> } */
    async hasAccess() {
      return new Promise((res) => {
        this.once('HAS_ACCESS', res)
        this.sendMessageToContent('HAS_ACCESS')
      })
    }

    /** @returns { Promise<boolean> } */
    async requestAccess() {
      return new Promise((res) => {
        this.once('RESPONSE_ACCESS', res)
        this.sendMessageToContent('REQUEST_ACCESS')
      })
    }

    /**
     * @param { string | string[] } [networks]
     * @returns { null | string[] }
     */
    _normalizeNetworks(networks) {
      if (typeof networks === 'string') return [networks]
      if (Array.isArray(networks) && networks.length > 0) return networks
      return null
    }

    /**
     * @param { string | string[] } [networks]
     * @returns { Promise<Account[]> } */
    async getPublicAccounts(networks) {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.once('GET_PUBLIC_ACCOUNTS', res)
        this.sendMessageToContent('GET_PUBLIC_ACCOUNTS', this._normalizeNetworks(networks))
      })
    }

    /** @returns { Promise<{[url: string]: boolean}> }} */
    async getAuthList() {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.once('GET_AUTH_LIST', res)
        this.sendMessageToContent('GET_AUTH_LIST')
      })
    }

    /**
     * @param { string | string[] } [networks]
     * @returns { Promise<Account | null> } */
    async selectAccount(networks) {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.once('SELECT_ACCOUNT', res)
        this.sendMessageToContent('SELECT_ACCOUNT', this._normalizeNetworks(networks))
      })
    }

    /**
     * @param { string | string[] } [networks]
     * @returns { Promise<Account | null> } */
    async selectDecryptedAccount(networks) {
      await this._hasAccessGuard()
      return new Promise((res) => {
        this.once('SELECT_DECRYPTED_ACCOUNT', res)
        this.sendMessageToContent('SELECT_DECRYPTED_ACCOUNT', this._normalizeNetworks(networks))
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
            this.once('LISTEN_PUBLIC_ACCOUNTS', (accounts) => {
              if (!_done) {
                callback(accounts)
                _listenToPublicAccounts()
              }
            })
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

    /**
     *
     * @param { (authList: {[url: string]: boolean}, error?: Error) => void } callback
     * @returns { () => void }
     */
    listenToAuthList(callback) {
      let _done = false
      this._hasAccessGuard()
        .then(() => {
          const _listenToAuthList = () => {
            this.once('LISTEN_AUTH_LIST', (authList) => {
              if (!_done) {
                callback(authList)
                _listenToAuthList()
              }
            })
          }

          _listenToAuthList()
          this.sendMessageToContent('LISTEN_AUTH_LIST')
        })
        .catch((error) => {
          _done = true
          callback({}, error)
        })

      return () => {
        if (!_done) {
          _done = true
          this.sendMessageToContent('STOP_LISTEN_AUTH_LIST')
        }
      }
    }

    /**
     * @param { string } content
     * @param { string } mnemonic
     * @param { 'sr25519' | 'ed25519'  } keypairType
     * @returns { Promise<SignReturn> }
     */
    async signTransaction(content, mnemonic, keypairType) {
      await this._hasAccessGuard()

      return new Promise((res) => {
        this.once('SIGN_TRANSACTION', res)
        this.sendMessageToContent('SIGN_TRANSACTION', { content, mnemonic, keypairType })
      })
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
