// @ts-check

/** @type { import("../src/global-components") } */
/** @typedef { import("./types").Message } Message */
/** @typedef { import("./types").HandlerCtx } HandlerCtx */
/** @typedef { import("./types").Commands } Commands */

class ContentHandler {
  /** @type { {[key: string]: undefined | ((ctx: HandlerCtx) => void) }} */ _backgroundHandlers = {}
  /** @type { {[key: string]: (message?: Message['data']) => void }} */ _injectHandlers = {}

  constructor() {
    this._injectScripts(['cmds', 'inject'])
    chrome.runtime.onMessage.addListener(this._backgroundMessageHandler.bind(this))
    window.addEventListener('message', this._injectMessageHandler.bind(this))
  }

  /**
   * @param { Commands } event
   * @param { undefined | ((ctx: HandlerCtx) => void) } handler
   */
  onBackground(event, handler) {
    this._backgroundHandlers[event] = handler
  }

  /**
   * @param { Commands } event
   * @param { (message?: Message['data']) => void } handler
   */
  onInject(event, handler) {
    this._injectHandlers[event] = handler
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

handler.onInject('REQUEST_ACCESS', () => {
  handler.sendMesssageToBackground('REQUEST_ACCESS')
})
