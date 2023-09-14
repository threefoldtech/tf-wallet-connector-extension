import { BusHandler, ContentRuntime, FileType } from './common'

class InjectHandler extends BusHandler {
  public constructor() {
    super(FileType.Inject)

    this.listenToContent(ContentRuntime.browser)

    this.sendToContent('WELCOME', 'hello world')
  }
}

const injectHandler = new InjectHandler()

console.log({ injectHandler })

injectHandler.addContentEventListener<true, string>('WELCOME', (message) =>
  console.log({ message })
)
