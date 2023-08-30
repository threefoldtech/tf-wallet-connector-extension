/* Send message to `content.js` */
export function sendMessage<T>(
  cmd: keyof Window['$TF_WALLET_CONNECTOR_EXTENSION_CMDS'],
  data?: any
) {
  if (import.meta.env.DEV) {
    return Promise.resolve()
  }

  return new Promise<T>((res) => {
    return chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const tab = tabs[0]
      if (!tab || !tab.id) {
        return
      }
      return chrome.tabs.sendMessage(
        tab.id,
        { cmd: window.$TF_WALLET_CONNECTOR_EXTENSION_CMDS[cmd], data },
        res
      )
    })
  })
}
