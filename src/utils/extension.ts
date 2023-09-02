export async function sendMessageToContent<T>(
  event: keyof Window['$TF_WALLET_CONNECTOR_EXTENSION_CMDS'],
  data?: any
) {
  if (import.meta.env.DEV) {
    return Promise.resolve()
  }

  return chrome.runtime.sendMessage({
    extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
    event,
    data
  })

  // const tabs = await window.chrome.tabs.query({ currentWindow: true, active: true })
  // return chrome.tabs.sendMessage(tabs.at(0)!.id!, {
  //   extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
  //   event,
  //   data
  // })

  // const tabId = await _getTabId()

  // return chrome.tabs.sendMessage(tabId, {
  //   extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
  //   event,
  //   data
  // })
}
