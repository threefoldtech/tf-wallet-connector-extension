import { BusEvents } from './busEvents'

export interface RuntimeContext<T> {
  message?: T
  sender: chrome.runtime.MessageSender
  sendResponse: (response?: any) => void
}

export type RuntimeHandler<T = unknown> = (ctx: RuntimeContext<T>) => void
export type InjectHandler<T = unknown> = (message?: T) => void

export type HandlerSet<T> = { [event in BusEvents]?: T[] }

export interface Message {
  extension: 'TF_WALLET_CONNECTOR_EXTENSION'
  event: BusEvents
  data?: any
}

export interface ListenerOptions {
  once?: boolean
}

export type Unsubscribe = () => void

// export type ExtensionEvents = 'TF_WALLET_CONNECTOR_EXTENSION' | 'HAS_ACCESS' | 'REQUEST_ACCESS'

// export type Unsubscribe = () => void
// export type HandlersTypes = 'inject' | 'content' | 'background'

// export interface Message {
//   extension: 'TF_WALLET_CONNECTOR_EXTENSION'
//   event: ExtensionEvents
//   data?: any
// }

// export interface AddEventListenerOptions {
//   once?: boolean
// }

// export function isExtensionMessage(message: any): message is Message {
//   return (
//     typeof message === 'object' &&
//     'extension' in message &&
//     message.extension === 'TF_WALLET_CONNECTOR_EXTENSION'
//   )
// }

// type EventHandlerSet = { [key in ExtensionEvents]?: Set<Function> }

// export abstract class CommonMixin {
//   private _injectHandlers: EventHandlerSet = {}
//   private _contentHandlers: EventHandlerSet = {}
//   private _backgroundHandlers: EventHandlerSet = {}

//   public constructor(private readonly handlersType: HandlersTypes) {}

//   protected addInjectEventListener(
//     event: ExtensionEvents,
//     handler: any,
//     options?: AddEventListenerOptions
//   ): Unsubscribe {
//     return this._addEventListener('inject', event, handler, options)
//   }

//   protected addContentEventListener(
//     event: ExtensionEvents,
//     handler: any,
//     options?: AddEventListenerOptions
//   ): Unsubscribe {
//     return this._addEventListener('content', event, handler, options)
//   }

//   protected addBackgroundEventListener(
//     event: ExtensionEvents,
//     handler: any,
//     options?: AddEventListenerOptions
//   ): Unsubscribe {
//     return this._addEventListener('background', event, handler, options)
//   }

//   private _addEventListener(
//     handlers: HandlersTypes,
//     event: ExtensionEvents,
//     handler: Function,
//     options?: AddEventListenerOptions
//   ): Unsubscribe {
//     if (this.handlersType === handlers) {
//       throw new Error(`Can't addEventListener(\`${handlers}\`) in handlersType(\`${handlers}\`).`)
//     }
//     if (options?.once) {
//       const _handler = handler
//       handler = (...args: any[]) => {
//         this[handlersProp][event].delete(handler)
//         _handler(...args)
//       }
//     }

//     const handlersProp = `_${handlers}Handlers`
//     this[handlersProp][event] = this[handlersProp][event] || new Set()

//     this[handlersProp][event].add(handler)
//     return () => {
//       this[handlersProp][event].delete(handler)
//     }
//   }

//   protected _checkEventListenerAndExec(event: ExtensionEvents, message?: any) {
//     const hdlrs = this.handlersType
//     const handlersProp = `_${hdlrs}Handlers`
//     if (event in this[handlersProp]) {
//       const handlers = this[handlersProp][event]
//       if (Array.isArray(handlers) && handlers.length > 0) {
//         const [handler] = this[handlersProp][event].splice(0, 1)
//         return handler(message)
//       }
//     }
//     console.warn(`Couldn't find listener for '(event: ${event})' in  (${hdlrs}Handlers).`)
//   }
// }
