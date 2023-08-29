// @ts-check

/** @type { import("../src/global-components") } */

/* Inject `inject.js` to ui */
{
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', window.chrome.runtime.getURL('inject.js'))
  document.body.appendChild(script)
}

/* Listen to message from extension */
window.chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { cmd, data } = /** @type {{cmd: string, data: any } }*/ message
  const cmds = window.$TF_WALLET_CONNECTOR_EXTENSION_CMDS

  switch (cmd) {
    case cmds.Login: {
      window.sessionStorage.setItem(window.$TF_WALLET_CONNECTOR_EXTENSION, JSON.stringify(data))
      sendMessage(data)
      return sendResponse(true)
    }

    case cmds.Logout: {
      window.sessionStorage.removeItem(window.$TF_WALLET_CONNECTOR_EXTENSION)
      sendMessage(null)
      return sendResponse(true)
    }

    case cmds.GetSessionStorage: {
      return sendResponse(
        JSON.parse(window.sessionStorage.getItem(window.$TF_WALLET_CONNECTOR_EXTENSION) || '""')
      )
    }

    default:
      return sendResponse(false)
  }
})

/* Pass data to ui */
/** @param { any } data */
function sendMessage(data) {
  document.dispatchEvent(
    new CustomEvent(window.$TF_WALLET_CONNECTOR_EXTENSION, {
      detail: data,
      bubbles: true,
      composed: true
    })
  )
}

window.addEventListener('load', init, { once: true })
function init() {
  // prettier-ignore
  const account = JSON.parse(window.sessionStorage.getItem(window.$TF_WALLET_CONNECTOR_EXTENSION) || '""')
  if (account) {
    sendMessage(account)
  }
}
