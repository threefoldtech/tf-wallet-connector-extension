import { BusHandler, FileType } from './common'
import { BusEvents } from './common/busEvents'

class ContentHandler extends BusHandler {
  public constructor() {
    super(FileType.Content)

    BusHandler.injectScripts(['cmds', 'inject'])

    this.listenToInject()
    this.listenToBackground()
  }
}

const contentHandler = new ContentHandler()

// Forwarding Bus
contentHandler.addInjectEventListener<{ event: BusEvents; data?: any; error?: string }>(
  'FORWARD_MESSAGE_BUS',
  (message) => {
    if (message) {
      return contentHandler.sendToBackground(message.event, message.data, message.error)
    }
  }
)

contentHandler.addBackgroundEventListener<{ event: BusEvents; data?: any; error?: string }>(
  'FORWARD_MESSAGE_BUS',
  ({ message, sendResponse }) => {
    sendResponse('ok')
    if (message) {
      return contentHandler.sendToInject(message.event, message.data, message.error)
    }
  }
)
