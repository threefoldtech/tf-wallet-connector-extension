let _tabId: number | undefined

export function initTabId(tabId?: number) {
  if (tabId) {
    _tabId = tabId
  }
}

export async function sendMessageToContent(
  event: keyof Window['$TF_WALLET_CONNECTOR_EXTENSION_CMDS'],
  data?: any
) {
  if (import.meta.env.DEV) {
    return Promise.resolve([])
  }

  const id = await getTabId()
  if (!id) return

  return chrome.tabs.sendMessage(id, {
    extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
    event,
    data
  })
}

export async function getTabId() {
  if (_tabId) {
    return _tabId
  }
  const tabs = await window.chrome.tabs.query({ currentWindow: true, active: true })
  return tabs.at(0)!.id!
}
