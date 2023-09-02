// @ts-check

/** @type { import("../src/global-components") } */
/** @typedef { import("./types").Message } Message */
/** @typedef { import("./types").Commands } Commands */

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
   */
  on(event, handler) {
    this._handlers[event] = handler
  }

  /**
   * @param { Commands } event
   * @param { undefined | Message['data'] } [data]
   */
  sendMessageToContent(event, data) {
    /** @type { Message } */ const msg = {
      extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
      event,
      data
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
}

const handler = new InjectHandler()

/* test only */
{
  const btn = document.createElement('button')
  btn.textContent = 'Request Access'
  btn.onclick = () => {
    handler.sendMessageToContent('REQUEST_ACCESS')
  }
  document.body.prepend(btn)
}
