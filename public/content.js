// @ts-check

{
  /** @type { import("../src/global-components") } */
  /** @typedef { import("./types").Message } Message */
  /** @typedef { import("./types").HandlerCtx } HandlerCtx */
  /** @typedef { import("./types").Commands } Commands */
  /** @typedef { import("./types").Account }  Account */

  const AUTH_LIST = window.$TF_WALLET_CONNECTOR_EXTENSION + '_AUTH_LIST'
  const ACCOUNTS = window.$TF_WALLET_CONNECTOR_EXTENSION + '_ACCOUNTS'

  class ContentHandler {
    /** @type { {[key: string]: (ctx: HandlerCtx) => void }} */ _backgroundHandlers = {}
    /** @type { {[key: string]: (message?: Message['data']) => void }} */ _injectHandlers = {}

    /** @type { {[key: string]: boolean} } */ _authList = {}
    get authList() {
      return { ...this._authList }
    }

    /** @type { Account[] } */ _accounts = []
    get accounts() {
      return [...this._accounts]
    }

    _notifyAccountsToInjectEnabled = false

    constructor() {
      this._injectScripts(['cmds', 'inject'])
      chrome.runtime.onMessage.addListener(this._backgroundMessageHandler.bind(this))
      window.addEventListener('message', this._injectMessageHandler.bind(this))

      this._initAuthList()
      this._initAccounts()
    }

    /**
     * @param { Account } account
     * @param { boolean } save
     */
    async addAccount(account, save = true) {
      if (this._findAccountIndex(account) === -1) {
        this._accounts.push(account)
        if (save) {
          await this._saveAccounts()
        }
      }
    }

    /**
     * @param { Account[] } accounts
     */
    async addAccounts(accounts) {
      accounts.forEach((account) => this.addAccount(account, false))
      this._saveAccounts()
    }

    /**
     * @param { Account } account
     */
    async deleteAccount(account) {
      const index = this._findAccountIndex(account)
      if (index > -1) {
        this._accounts = this._accounts.filter(({ mnemonic }) => mnemonic !== account.mnemonic)
        await this._saveAccounts()
      }
    }

    /**
     * @param { Account } account
     */
    async updateAccount(account) {
      const index = this._findAccountIndex(account)
      if (index > -1) {
        this._accounts[index] = account
        await this._saveAccounts()
      }
    }

    getPublicAccounts() {
      return this._accounts.filter((account) => account.visible)
    }

    notifyAccountsToInject() {
      this._notifyAccountsToInjectEnabled = true
      this._notifyAccountsToInject()
    }

    stopNotifyAccountsToInject() {
      this._notifyAccountsToInjectEnabled = false
    }

    /**
     * @param { string } url
     * @param { boolean } accept
     */
    async setAuth(url, accept) {
      this._authList[url] = accept
      await this._saveAuthList()
    }

    /**
     * @param { string } url
     */
    async toggleAuth(url) {
      this._authList[url] = !this._authList[url]
      await this._saveAuthList()
    }

    /** @param { string } url  */
    isAuth(url) {
      return this._authList[url] || false
    }

    /**
     * @param { string } url
     */
    async deleteAuth(url) {
      delete this._authList[url]
      await this._saveAuthList()
    }

    /**
     * @param { Commands } event
     * @param { (ctx: HandlerCtx) => void } handler
     */
    onBackground(event, handler) {
      this._backgroundHandlers[event] = handler
    }

    /**
     * @param { Commands } event
     * @param { (message?: Message['data']) => void } handler
     */
    onInject(event, handler) {
      if (event === 'REQUEST_ACCESS' || event === 'HAS_ACCESS') {
        this._injectHandlers[event] = handler
      } else {
        this._injectHandlers[event] = (...args) => {
          /* Must check if it's allowed to access content using this site */
          if (!this.isAuth(window.location.origin)) {
            throw new Error('Please make sure to get access permission before continue.')
          }
          handler(...args)
        }
      }
    }

    /**
     * @param { Commands } event
     * @param { undefined | Message['data'] } [data]
     */
    sendMesssageToBackground(event, data) {
      return chrome.runtime.sendMessage({
        extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
        event,
        data
      })
    }

    /**
     * @param { Commands } event
     * @param { undefined | Message['data'] } data
     */
    sendMessageToInject(event, data) {
      /** @type { Message} */ const msg = {
        extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
        event,
        data
      }
      document.dispatchEvent(
        new CustomEvent(window.$TF_WALLET_CONNECTOR_EXTENSION, {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: msg
        })
      )
    }

    /**
     * @param { string[] } scriptNames
     */
    _injectScripts(scriptNames) {
      for (const name of scriptNames) {
        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', window.chrome.runtime.getURL(`${name}.js`))
        document.body.appendChild(script)
      }
    }

    /**
     * @param { Message } message
     * @param { chrome.runtime.MessageSender } sender
     * @param { (response?: any) => void } sendResponse
     */
    _backgroundMessageHandler(message, sender, sendResponse) {
      if (
        typeof message === 'object' &&
        'extension' in message &&
        message.extension === 'TF_WALLET_CONNECTOR_EXTENSION'
      ) {
        if (
          message.event in this._backgroundHandlers &&
          typeof this._backgroundHandlers[message.event] === 'function'
        ) {
          const fn = this._backgroundHandlers[message.event]
          if (fn) {
            fn({
              message: message.data,
              sender,
              sendResponse
            })
          }
        }
      }
    }

    /**
     *
     * @param { MessageEvent<Message> } event
     */
    _injectMessageHandler({ data: message }) {
      if (
        typeof message === 'object' &&
        'extension' in message &&
        message.extension === 'TF_WALLET_CONNECTOR_EXTENSION'
      ) {
        if (message.event in this._injectHandlers) {
          return this._injectHandlers[message.event](message.data)
        }
        console.log(`[TF_WALLET_CONNECTOR_EXTENSION] Unsupported event ${message.event}.`)
      }
    }

    _saveAuthList() {
      return chrome.storage.sync.set({ [AUTH_LIST]: JSON.stringify(this._authList) })
    }

    async _getAuthList() {
      const storage = await chrome.storage.sync.get(AUTH_LIST)
      if (storage[AUTH_LIST]) {
        return JSON.parse(storage[AUTH_LIST])
      }
      return {}
    }

    async _initAuthList() {
      this._authList = await this._getAuthList()
    }

    async _saveAccounts() {
      if (this._notifyAccountsToInjectEnabled) {
        this._notifyAccountsToInject()
      }
      return chrome.storage.sync.set({ [ACCOUNTS]: JSON.stringify(this._accounts) })
    }

    /** @returns { Promise<Account[]> } */
    async _getAccounts() {
      const storage = await chrome.storage.sync.get(ACCOUNTS)
      if (storage[ACCOUNTS]) {
        return JSON.parse(storage[ACCOUNTS])
      }
      return []
    }

    async _initAccounts() {
      this._accounts = await this._getAccounts()
    }

    /** @param { Account} account  */
    _findAccountIndex(account) {
      return this._accounts.findIndex(({ mnemonic }) => mnemonic === account.mnemonic)
    }

    _notifyAccountsToInject() {
      this.sendMessageToInject('GET_PUBLIC_ACCOUNTS', this.getPublicAccounts())
    }
  }

  const handler = new ContentHandler()

  handler.onBackground('RESPONSE_ACCESS', ({ message, sendResponse }) => {
    handler.setAuth(window.location.origin, message)
    handler.sendMessageToInject('RESPONSE_ACCESS', message)
    sendResponse('ok')
  })

  handler.onBackground('GET_AUTH_LIST', ({ sendResponse }) => {
    sendResponse(handler.authList)
  })

  handler.onBackground('TOGGLE_ACCESS_PERMISSION', ({ message, sendResponse }) => {
    handler.toggleAuth(message)
    sendResponse('ok')
  })

  handler.onBackground('DELETE_ACCESS_PERMISSION', ({ message, sendResponse }) => {
    handler.deleteAuth(message)
    sendResponse('ok')
  })

  handler.onBackground('ADD_ACCOUNTS', ({ message, sendResponse }) => {
    handler.addAccounts(message)
    sendResponse('ok')
  })

  handler.onBackground('GET_ACCOUNTS', ({ sendResponse }) => sendResponse(handler.accounts))
  handler.onBackground('ADD_ACCOUNT', ({ message, sendResponse }) => {
    handler.addAccount(message)
    sendResponse('ok')
  })
  handler.onBackground('UPDATE_ACCOUNT', ({ message, sendResponse }) => {
    handler.updateAccount(message)
    sendResponse('ok')
  })
  handler.onBackground('DELETE_ACCOUNT', ({ message, sendResponse }) => {
    handler.deleteAccount(message)
    sendResponse('ok')
  })

  handler.onBackground('REQUEST_DECRYPTED_ACCOUNT', ({ message, sendResponse }) => {
    handler.sendMessageToInject('REQUEST_DECRYPTED_ACCOUNT', message)
    sendResponse('ok')
  })

  handler.onBackground('SELECT_DECRYPTED_ACCOUNT', ({ message, sendResponse }) => {
    handler.sendMessageToInject('SELECT_DECRYPTED_ACCOUNT', message)
    sendResponse('ok')
  })

  handler.onInject('HAS_ACCESS', () => {
    handler.sendMessageToInject('HAS_ACCESS', handler.isAuth(window.location.origin))
  })

  handler.onInject('REQUEST_ACCESS', () => {
    if (handler.isAuth(window.location.origin)) {
      return handler.sendMessageToInject('RESPONSE_ACCESS', true)
    }
    handler.sendMesssageToBackground('REQUEST_ACCESS')
  })

  handler.onInject('GET_PUBLIC_ACCOUNTS', () => handler._notifyAccountsToInject())
  handler.onInject('LISTEN_PUBLIC_ACCOUNTS', () => handler.notifyAccountsToInject())
  handler.onInject('STOP_LISTEN_PUBLIC_ACCOUNTS', () => handler.stopNotifyAccountsToInject())
  handler.onInject('REQUEST_DECRYPTED_ACCOUNT', (message) => {
    handler.sendMesssageToBackground('REQUEST_DECRYPTED_ACCOUNT', message)
  })
  handler.onInject('SELECT_DECRYPTED_ACCOUNT', () =>
    handler.sendMesssageToBackground('SELECT_DECRYPTED_ACCOUNT')
  )
}
