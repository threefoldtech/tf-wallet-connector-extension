import type { Network } from '@/types'

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

  return chrome.tabs
    .sendMessage(id, {
      extension: window.$TF_WALLET_CONNECTOR_EXTENSION,
      event: 'FORWARD_MESSAGE_BUS',
      data: { event, data }
    })
    .catch((error) => {
      /* Skip error */
      console.log(error)
      return
    })
}

async function getTab() {
  if (import.meta.env.DEV) {
    return null
  }

  const tabs = await window.chrome.tabs.query({ currentWindow: true, active: true })
  return tabs.at(0)
}

export async function getTabId() {
  if (_tabId) {
    return _tabId
  }
  const tab = await getTab()
  return tab?.id
}

export async function getNetwork(): Promise<Network> {
  const tab = await getTab()
  const url = tab?.url

  if (url) {
    if (url.includes('.dev.')) return 'dev'
    if (url.includes('.test.')) return 'test'
    if (url.includes('.qa.')) return 'qa'
  }

  return 'main'
}
