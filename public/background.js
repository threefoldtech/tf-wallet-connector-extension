// @ts-check

/** @typedef { import("./types").Message } Message */

class BackgroundHandler {
  _handlers = {}

  constructor() {
    chrome.runtime.onMessage.addListener(this._messageHandler.bind(this))
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

  /**
   *
   * @param { { event: string, data?: any } } message
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
   *
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
   * @typedef { Object } HandlerCtx
   * @property { any | null } message
   * @property { chrome.runtime.MessageSender } sender
   * @property { (response?: any) => void } sendResponse
   */

  /**
   *
   * @param { string } event
   * @param { (ctx: HandlerCtx) => void } handler
   */
  on(event, handler) {
    this._handlers[event] = handler
  }
}

const backgroundHandler = new BackgroundHandler()

backgroundHandler.on('RequestAccess', ({ message, sendResponse }) => {
  console.log(message)
  sendResponse('Is that even working?')
})

// /** @type { declare } */

// console.log('background')
// console.log(chrome.runtime.getURL('index.html'))

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   const t = tabs[0]!.id
//   chrome.windows.create({
//     url: chrome.runtime.getURL('index.html'),
//     type: 'popup' //No Address bar
//     //In here you can also add constrain for the window
//     //This is for manifest v3
//   })
//   //   console.log({ chrome, tabs })
//   // window.chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});
// })

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log(message)
//   if (message === 'RequestAccess') {
//     console.log('request access')
//   }
//   //   if (message.data === 'init') {
//   //     return sendResponse({
//   //       requestAccess: () => {
//   //         chrome.windows.create({
//   //           url: chrome.runtime.getURL('index.html'),
//   //           type: 'popup'
//   //         })
//   //       }
//   //     })
//   //   }

//   sendResponse('Thanks')
// })
