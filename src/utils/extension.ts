export async function sendMessageToContent<T>(
  event: keyof Window['$TF_WALLET_CONNECTOR_EXTENSION_CMDS'],
  data?: any,
  tabId?: number
) {
  if (import.meta.env.DEV) {
    return Promise.resolve()
  }

  const id = tabId || (await window.chrome.tabs.query({ currentWindow: true, active: true }))[0].id!
  return chrome.tabs.sendMessage(id, {
    extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
    event,
    data
  })
}
