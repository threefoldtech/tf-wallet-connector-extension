import type { BusEvents } from './busEvents'
import type {
  HandlerSet,
  RuntimeHandler,
  InjectHandler,
  Message,
  Unsubscribe,
  ListenerOptions
} from './types'

export enum FileType {
  Inject,
  Content,
  Background
}

export enum ContentRuntime {
  browser,
  extension
}

export abstract class BusHandler {
  private _injectHandlers: HandlerSet<InjectHandler> = {}
  private _contentHandlers: HandlerSet<RuntimeHandler | InjectHandler> = {}
  private _backgroundHandlers: HandlerSet<RuntimeHandler> = {}

  public constructor(private readonly type: FileType) {}

  public listenToInject(): Unsubscribe {
    BusHandler.assertFileType('listenToInject', this.type, FileType.Inject)
    BusHandler.assertFileType('listenToInject', this.type, FileType.Background)

    const listenToInject = (event: Event) => {
      const { data: message } = event as unknown as { data: any }
      if (BusHandler.isExtensionMessage(message)) {
        const handler = this.popEvent(this._injectHandlers[message.event])
        if (handler) {
          return handler(message.data)
        }
        console.warn(`Event of type(${message.event}) is not yet registered on inject handlers.`)
      }
    }

    window.addEventListener('message', listenToInject)
    return () => {
      window.removeEventListener('message', listenToInject)
    }
  }

  public listenToContent(runtime: ContentRuntime): Unsubscribe {
    BusHandler.assertFileType('listenToContent', this.type, FileType.Content)

    if (runtime === ContentRuntime.browser) {
      const listenToContent = (event: Event) => {
        const { detail } = event as CustomEvent<Message>
        if (BusHandler.isExtensionMessage(detail)) {
          const handler = this.popEvent(this._contentHandlers[detail.event])
          if (handler) {
            return handler(detail.data)
          }
          console.warn(`Event of type(${detail.event}) is not yet registered on content handlers.`)
        }
      }

      document.addEventListener('TF_WALLET_CONNECTOR_EXTENSION', listenToContent)
      return () => {
        document.removeEventListener('TF_WALLET_CONNECTOR_EXTENSION', listenToContent)
      }
    }

    const listenToContent = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: InjectHandler
    ) => {
      if (BusHandler.isExtensionMessage(message)) {
        const handler = this.popEvent(this._contentHandlers[message.event])
        if (handler) {
          return handler({ sender, sendResponse, message: message.data })
        }
        console.warn(`Event of type(${message.event}) is not yet registered on content handlers.`)
      }
    }

    chrome.runtime.onMessage.addListener(listenToContent)
    return () => {
      chrome.runtime.onMessage.removeListener(listenToContent)
    }
  }

  public listenToBackground(): Unsubscribe {
    BusHandler.assertFileType('listenToBackground', this.type, FileType.Inject)
    BusHandler.assertFileType('listenToBackground', this.type, FileType.Background)

    const listenToBackground = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: InjectHandler
    ) => {
      if (BusHandler.isExtensionMessage(message)) {
        const handler = this.popEvent(this._backgroundHandlers[message.event])
        if (handler) {
          return handler({ sender, sendResponse, message: message.data })
        }
        console.warn(
          `Event of type(${message.event}) is not yet registered on background handlers.`
        )
      }
    }

    chrome.runtime.onMessage.addListener(listenToBackground)
    return () => {
      chrome.runtime.onMessage.removeListener(listenToBackground)
    }
  }

  public addInjectEventListener<T>(
    event: BusEvents,
    handler: InjectHandler<T>,
    options?: ListenerOptions
  ): Unsubscribe {
    BusHandler.assertFileType('addInjectEventListener', this.type, FileType.Inject)

    const fn = this.onceHandler(
      handler,
      () => this.deleteHandler(this._injectHandlers[event]!, fn),
      options?.once
    )

    this._injectHandlers[event] = this._injectHandlers[event] || []
    this._injectHandlers[event]!.push(fn)

    return () => this.deleteHandler(this._injectHandlers[event]!, fn)
  }

  public addContentEventListener<Inject = true, T = unknown>(
    event: BusEvents,
    handler: Inject extends false ? RuntimeHandler<T> : InjectHandler<T>,
    options?: ListenerOptions
  ): Unsubscribe {
    BusHandler.assertFileType('addContentEventListener', this.type, FileType.Content)

    const fn = this.onceHandler(
      handler,
      () => this.deleteHandler(this._contentHandlers[event]!, fn),
      options?.once
    )

    this._contentHandlers[event] = this._contentHandlers[event] || []
    this._contentHandlers[event]!.push(fn)

    return () => this.deleteHandler(this._contentHandlers[event]!, fn)
  }

  public addBackgroundEventListener<T>(
    event: BusEvents,
    handler: RuntimeHandler<T>,
    options?: ListenerOptions
  ): Unsubscribe {
    BusHandler.assertFileType('addBackgroundEventListener', this.type, FileType.Background)

    const fn = this.onceHandler(
      handler,
      () => this.deleteHandler(this._backgroundHandlers[event]!, fn),
      options?.once
    )

    this._backgroundHandlers[event] = this._backgroundHandlers[event] || []
    this._backgroundHandlers[event]!.push(fn)

    return () => this.deleteHandler(this._backgroundHandlers[event]!, fn)
  }

  public sendToInject(event: BusEvents, data?: any) {
    BusHandler.assertFileType('sendToInject', this.type, FileType.Inject)

    const message: Message = { extension: 'TF_WALLET_CONNECTOR_EXTENSION', event, data }
    return document.dispatchEvent(
      new CustomEvent('TF_WALLET_CONNECTOR_EXTENSION', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: message
      })
    )
  }

  public sendToContent(event: BusEvents, data?: any, tabId?: number) {
    BusHandler.assertFileType('sendToContent', this.type, FileType.Content)

    const message: Message = { extension: 'TF_WALLET_CONNECTOR_EXTENSION', event, data }

    if (this.type === FileType.Inject) {
      return window.postMessage(message)
    }

    return this.getTabId(tabId).then((tabId) => {
      if (tabId) {
        return chrome.tabs.sendMessage(tabId, message)
      }
      console.warn("Couldn't allocate tabId to send the message for event(`" + event + '`).')
    })
  }

  public sendToBackground(event: BusEvents, data?: any) {
    BusHandler.assertFileType('sendToBackground', this.type, FileType.Background)

    const message: Message = { extension: 'TF_WALLET_CONNECTOR_EXTENSION', event, data }
    return chrome.runtime.sendMessage(message)
  }

  private deleteHandler<T>(handlers: T[], handler: T): boolean {
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
      return true
    }
    return false
  }

  private onceHandler<T extends Function>(handler: T, cb: () => void, once?: boolean): T {
    if (!once) {
      return handler
    }

    return ((...args: any[]) => {
      cb()
      handler(...args)
    }) as unknown as T
  }

  private popEvent<T>(handlers?: T[]): T | null {
    if (handlers?.length) {
      const [handler] = handlers.splice(0, 1)
      return handler
    }
    return null
  }

  private async getTabId(tabId?: number | undefined): Promise<number | undefined> {
    if (tabId) {
      return tabId
    }

    const window = await chrome.windows.getCurrent()
    const tabs = await chrome.tabs.query({ active: true, windowId: window.id })
    return tabs?.[0].id
  }

  protected static injectScripts(names: string[]) {
    for (const name of names) {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', window.chrome.runtime.getURL(`${name}.js`))
      document.body.appendChild(script)
    }
  }

  protected static isExtensionMessage(message: any): message is Message {
    return (
      typeof message === 'object' &&
      'extension' in message &&
      message.extension === 'TF_WALLET_CONNECTOR_EXTENSION'
    )
  }

  private static assertFileType(
    method: string,
    currentFileType: FileType,
    passedFileType: FileType
  ) {
    if (currentFileType === passedFileType) {
      throw new Error(method + ' expecting to be used in non `' + currentFileType + '` fileType.')
    }
  }
}
