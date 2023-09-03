export async function sendMessageToContent<T>(
  event: keyof Window['$TF_WALLET_CONNECTOR_EXTENSION_CMDS'],
  data?: any,
  tabId?: number
) {
  if (import.meta.env.DEV) {
    return Promise.resolve([])
  }

  const id = tabId || (await getTabId())
  return chrome.tabs.sendMessage(id, {
    extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
    event,
    data
  })
}

export async function getTabId() {
  const tabs = await window.chrome.tabs.query({ currentWindow: true, active: true })
  return tabs.at(0)!.id!
}
