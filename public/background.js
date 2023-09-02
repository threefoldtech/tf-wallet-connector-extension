// @ts-check

/** @typedef { import("./types").Message } Message */
/** @typedef { import("./types").HandlerCtx } HandlerCtx */
/** @typedef { import("./types").Commands } Commands */

class BackgroundHandler {
  /** @type { {[key: string]: (ctx: HandlerCtx) => void } } */ _handlers = {}

  constructor() {
    chrome.runtime.onMessage.addListener(this._messageHandler.bind(this))
  }

  /**
   * @param { Commands } event
   * @param { (ctx: HandlerCtx) => void } handler
   */
  on(event, handler) {
    this._handlers[event] = handler
  }

  /**
   * @param { { event: Commands, data?: any } } message
   */
  async sendMessageToContentScript(message) {
    const tabId = await this._getTabId()

    const msg = {
      extension: 'TF_WALLET_CONNECTOR_EXTENSION',
      event: message.event,
      data: message.data
    }

    return chrome.tabs.sendMessage(tabId, msg)
  }

  /**
   * @param { Message } message
   * @param { chrome.runtime.MessageSender } sender
   * @param { (response?: any) => void } sendResponse
   */
  _messageHandler(message, sender, sendResponse) {
    if (
      typeof message === 'object' &&
      'extension' in message &&
      message.extension === 'TF_WALLET_CONNECTOR_EXTENSION'
    ) {
      if (message.event in this._handlers) {
        return this._handlers[message.event]({ message: message.data, sender, sendResponse })
      }
      console.log(`[TF_WALLET_CONNECTOR_EXTENSION] Unsupported event ${message.event}.`)
    }
  }

  /**
   * @returns { Promise<number> }
   */
  _getTabId() {
    return new Promise((res) => {
      return chrome.windows.getCurrent((w) => {
        return chrome.tabs.query({ active: true, windowId: w.id }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].id) {
            return res(tabs[0].id)
          }
        })
      })
    })
  }
}

const handler = new BackgroundHandler()

handler.on('REQUEST_ACCESS', () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('index.html') + '#/request-access',
    height: 600,
    width: 535,
    top: 50,
    left: 50,
    focused: true,
    type: 'popup'
  })
})
