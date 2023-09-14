import { BusHandler, ContentRuntime, FileType } from './common'

class BackgroundHandler extends BusHandler {
  public constructor() {
    super(FileType.Background)

    this.listenToContent(ContentRuntime.extension)
  }
}

const backgroundHandler = new BackgroundHandler()

console.log({ backgroundHandler })

backgroundHandler.addContentEventListener<false, string>('WELCOME', ({ message, sendResponse }) => {
  console.log('[background] from content', message)
  sendResponse(message)
})
