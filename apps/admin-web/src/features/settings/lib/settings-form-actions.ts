type Handler = (() => void) | null

let saveHandler: Handler = null

export function registerSettingsSave(handler: () => void) {
  saveHandler = handler
  return () => {
    if (saveHandler === handler) saveHandler = null
  }
}

export function triggerSettingsSave() {
  saveHandler?.()
}
