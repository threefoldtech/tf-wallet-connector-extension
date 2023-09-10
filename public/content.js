// @ts-check

{
  /** @type { import("../src/global-components") } */
  /** @typedef { import("./types").Message } Message */
  /** @typedef { import("./types").HandlerCtx } HandlerCtx */
  /** @typedef { import("./types").Commands } Commands */
  /** @typedef { import("./types").Account }  Account */
  /** @typedef { import('./types').PublicAccount } PublicAccount */

  const AUTH_LIST = window.$TF_WALLET_CONNECTOR_EXTENSION + '_AUTH_LIST'
  const ACCOUNTS = window.$TF_WALLET_CONNECTOR_EXTENSION + '_ACCOUNTS'

  class ContentHandler {
    /** @type { {[key: string]: (ctx: HandlerCtx) => void }} */ _backgroundHandlers = {}
    /** @type { {[key: string]: (message?: Message['data']) => void }} */ _injectHandlers = {}

    _notifyAccountsToInjectEnabled = false
    _notifyAuthListToInjectEnabled = false

    constructor() {
      this._injectScripts(['cmds', 'inject'])
      chrome.runtime.onMessage.addListener(this._backgroundMessageHandler.bind(this))
      window.addEventListener('message', this._injectMessageHandler.bind(this))
    }

    /**
     * @param { string[] } [networks]
     * @returns { Promise<PublicAccount[]> } */
    async getPublicAccounts(networks) {
      const storage = await chrome.storage.sync.get(ACCOUNTS)
      /** @type {Account[]} */ let accounts = JSON.parse(storage[ACCOUNTS] || '[]')
      accounts = accounts.filter((account) => account.visible)

      if (networks) {
        accounts = accounts.filter((account) => {
          return account.networks.some((network) => networks.includes(network))
        })
      }

      return accounts.map((account) => {
        return {
          name: account.name,
          address: account.address,
          metadata: {},
          networks: account.networks,
          encryptedMnemonic: true,
          mnemonic: account.mnemonic
        }
      })
    }

    notifyAccountsToInject() {
      this._notifyAccountsToInjectEnabled = true
    }

    notifyAuthListToInject() {
      this._notifyAuthListToInjectEnabled = true
    }

    stopNotifyAccountsToInject() {
      this._notifyAccountsToInjectEnabled = false
    }

    stopNotifyAuthListToInject() {
      this._notifyAuthListToInjectEnabled = false
    }

    /**
     * @param { Commands } event
     * @param { (ctx: HandlerCtx) => void } handler
     */
    onBackground(event, handler) {
      this._backgroundHandlers[event] = handler
    }

    /** @returns { Promise<{[url: string]: boolean}> } */
    async getAuthList() {
      const storage = await chrome.storage.sync.get(AUTH_LIST)
      return JSON.parse(storage[AUTH_LIST] || '{}')
    }

    /**
     * @param { string } url
     * @returns { Promise<boolean> }
     */
    async isAuth(url) {
      const authList = await this.getAuthList()
      return authList[url] || false
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
          this.isAuth(window.location.origin)
            .then((auth) => {
              if (!auth) {
                throw new Error('Please make sure to get access permission before continue.')
              }
            })
            .then(() => handler(...args))
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
  }

  const handler = new ContentHandler()

  handler.onBackground('RESPONSE_ACCESS', ({ message, sendResponse }) => {
    handler.sendMessageToInject('RESPONSE_ACCESS', message)
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

  handler.onBackground('LISTEN_PUBLIC_ACCOUNTS', async ({ sendResponse }) => {
    if (handler._notifyAccountsToInjectEnabled) {
      handler.sendMessageToInject('LISTEN_PUBLIC_ACCOUNTS', await handler.getPublicAccounts())
    }
    sendResponse('ok')
  })

  handler.onBackground('LISTEN_AUTH_LIST', async ({ sendResponse }) => {
    if (handler._notifyAuthListToInjectEnabled) {
      handler.sendMessageToInject('LISTEN_AUTH_LIST', await handler.getAuthList())
    }
    sendResponse('ok')
  })

  handler.onBackground('SELECT_ACCOUNT', ({ message, sendResponse }) => {
    handler.sendMessageToInject('SELECT_ACCOUNT', message)
    sendResponse('ok')
  })

  handler.onInject('HAS_ACCESS', async () => {
    handler.sendMessageToInject('HAS_ACCESS', await handler.isAuth(window.location.origin))
  })

  handler.onInject('REQUEST_ACCESS', async () => {
    if (await handler.isAuth(window.location.origin)) {
      return handler.sendMessageToInject('RESPONSE_ACCESS', true)
    }
    handler.sendMesssageToBackground('REQUEST_ACCESS')
  })

  handler.onInject('GET_PUBLIC_ACCOUNTS', async (message) => {
    handler.sendMessageToInject('GET_PUBLIC_ACCOUNTS', await handler.getPublicAccounts(message))
  })

  handler.onInject('GET_AUTH_LIST', async () => {
    handler.sendMessageToInject('GET_AUTH_LIST', await handler.getAuthList())
  })

  handler.onInject('SELECT_ACCOUNT', (message) => {
    handler.sendMesssageToBackground('SELECT_ACCOUNT', message)
  })

  handler.onInject('LISTEN_PUBLIC_ACCOUNTS', async () => {
    handler.notifyAccountsToInject()
    handler.sendMessageToInject('LISTEN_PUBLIC_ACCOUNTS', await handler.getPublicAccounts())
  })
  handler.onInject('LISTEN_AUTH_LIST', async () => {
    handler.notifyAuthListToInject()
    handler.sendMessageToInject('LISTEN_AUTH_LIST', await handler.getAuthList())
  })

  handler.onInject('STOP_LISTEN_PUBLIC_ACCOUNTS', () => handler.stopNotifyAccountsToInject())
  handler.onInject('STOP_LISTEN_AUTH_LIST', () => handler.stopNotifyAuthListToInject())
  handler.onInject('REQUEST_DECRYPTED_ACCOUNT', (message) => {
    handler.sendMesssageToBackground('REQUEST_DECRYPTED_ACCOUNT', message)
  })
  handler.onInject('SELECT_DECRYPTED_ACCOUNT', (message) =>
    handler.sendMesssageToBackground('SELECT_DECRYPTED_ACCOUNT', message)
  )
}
