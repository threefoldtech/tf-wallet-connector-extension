// @ts-check

/** @type { import("../src/global-components") } */

chrome.runtime.sendMessage(
  {
    extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
    event: 'RequestAccess',
    data: null
  },
  (response) => {
    console.log(response)
  }
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log({ message, sender, sendResponse })
})

window.addEventListener('message', (e) => {
  console.log(e)
})

// /**
//  * @param { string } name
//  */
function injectScript(name) {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', window.chrome.runtime.getURL(`${name}.js`))
  document.body.appendChild(script)
}

/* Inject `inject.js` & `cmds.js` to ui */
injectScript('cmds')
injectScript('inject')

// class ContentHandler {
//   constructor() {
//     this._handlers = {}
//     window.chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
//       const { cmd, data } = /** @type {{cmd: string, data: any } }*/ message
//       const cmds = window.$TF_WALLET_CONNECTOR_EXTENSION_CMDS
//     })
//   }

//   /**
//    *
//    * @param { string } cmd
//    * @param { (ctx: { message: any, sender: chrome.runtime.MessageSender, sendResponse(response?: any): void }) => void } handler
//    */
//   on(cmd, handler) {
//     this._handlers[cmd] = handler
//   }
// }

// /* Listen to message from extension */
// window.chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
//   const { cmd, data } = /** @type {{cmd: string, data: any } }*/ message
//   const cmds = window.$TF_WALLET_CONNECTOR_EXTENSION_CMDS

//   switch (cmd) {
//     case cmds.Login: {
//       window.sessionStorage.setItem(window.$TF_WALLET_CONNECTOR_EXTENSION, JSON.stringify(data))
//       sendMessage(data)
//       return sendResponse(true)
//     }

//     case cmds.Logout: {
//       window.sessionStorage.removeItem(window.$TF_WALLET_CONNECTOR_EXTENSION)
//       sendMessage(null)
//       return sendResponse(true)
//     }

//     case cmds.GetSessionStorage: {
//       return sendResponse(
//         JSON.parse(window.sessionStorage.getItem(window.$TF_WALLET_CONNECTOR_EXTENSION) || '""')
//       )
//     }

//     default:
//       return sendResponse(false)
//   }
// })

// /* Pass data to ui */
// /** @param { any } data */
// function sendMessage(data) {
//   document.dispatchEvent(
//     new CustomEvent(window.$TF_WALLET_CONNECTOR_EXTENSION, {
//       detail: data,
//       bubbles: true,
//       composed: true
//     })
//   )
// }
// /* Pass data to background */
// function bgSendMessage(data) {
//   chrome.runtime.sendMessage({ data }, (response) => {
//     console.log(response)
//   })
// }

// window.addEventListener('load', init, { once: true })
// function init() {
//   bgSendMessage('init')

//   // prettier-ignore
//   const account = JSON.parse(window.sessionStorage.getItem(window.$TF_WALLET_CONNECTOR_EXTENSION) || '""')
//   if (account) {
//     sendMessage(account)
//   }
// }
