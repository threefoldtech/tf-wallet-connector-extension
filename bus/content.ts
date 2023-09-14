import { BusHandler, FileType } from './common'

class ContentHandler extends BusHandler {
  public constructor() {
    super(FileType.Content)

    BusHandler.injectScripts(['cmds', 'inject'])

    this.listenToInject()
    this.listenToBackground()
  }
}

const contentHandler = new ContentHandler()

console.log({ contentHandler })

contentHandler.addInjectEventListener('WELCOME', async (message) => {
  console.log('[content]', 'from inject', message)
  const msg = await contentHandler.sendToBackground('WELCOME', message)
  console.log('[content]', 'from background', msg)
  contentHandler.sendToInject('WELCOME', message)
})
