import type { Unsubscribe, Message, ExtensionEvents } from './common'
import { isExtensionMessage, CommonMixin } from './common'

export type ContentApis = 'document' | 'chrome'

export abstract class ContentMixin extends CommonMixin {
  public constructor() {
    super('content')
  }

  public sendToContent(api: 'document', event: ExtensionEvents, data?: any): void
  public sendToContent(api: 'chrome', event: ExtensionEvents, data?: any, tabId?: number): Promise<any>; // prettier-ignore
  public sendToContent(api: ContentApis, event: ExtensionEvents, data?: any, tabId?: number) {
    this._assertApi('sendToContent', api)
    const message: Message = { extension: 'TF_WALLET_CONNECTOR_EXTENSION', event, data }

    if (api === 'chrome') {
      return this.getTabId(tabId).then((tabId) => {
        if (tabId) {
          return chrome.tabs.sendMessage(tabId, message)
        }
      })
    }

    return window.postMessage(message)
  }

  public listenToContent(api: ContentApis): Unsubscribe {
    this._assertApi('listenToContent', api)

    if (api === 'document') {
      const listenToContentDocument = (event: Event) => {
        const { detail } = event as CustomEvent<Message>
        if (isExtensionMessage(detail)) {
          return this._checkEventListenerAndExec(detail.event, detail.data)
        }
      }
      document.addEventListener('TF_WALLET_CONNECTOR_EXTENSION', listenToContentDocument)
      return () => {
        document.removeEventListener('TF_WALLET_CONNECTOR_EXTENSION', listenToContentDocument)
      }
    }

    const listenToContentChrome = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (isExtensionMessage(message)) {
        return this._checkEventListenerAndExec(message.event, {
          message: message.data,
          sender,
          sendResponse
        })
      }
    }
    chrome.runtime.onMessage.addListener(listenToContentChrome)
    return () => {
      chrome.runtime.onMessage.removeListener(listenToContentChrome)
    }
  }

  protected async getTabId(tabId?: number): Promise<number | undefined> {
    if (typeof tabId === 'number') {
      return tabId
    }
    const window = await chrome.windows.getCurrent()
    const tabs = await chrome.tabs.query({ active: true, windowId: window.id })
    return tabs?.[0].id
  }

  // prettier-ignore
  private _assertApi(method: string, api: ContentApis) {
    if (api !== 'document' && api !== 'chrome') {
      throw new Error(method + " expecting api parameter of type `'document' | 'chrome'` but got api(`" + api + "`)")
    }
  }
}
