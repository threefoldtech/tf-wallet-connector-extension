import type { Network } from '@/types'
import type { BusEvents } from '../../bus/common/busEvents'

let _tabId: number | undefined

export function initTabId(tabId?: number) {
  if (tabId) {
    _tabId = tabId
  }
}

export async function sendMessageToContent(event: BusEvents, data?: any) {
  if (import.meta.env.DEV) {
    return Promise.resolve([])
  }

  const id = await getTabId()
  if (!id) return

  return chrome.tabs
    .sendMessage(id, {
      extension: 'TF_WALLET_CONNECTOR_EXTENSION',
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
