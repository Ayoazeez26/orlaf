type Handler = (() => void) | null

let saveHandler: Handler = null
let resetHandler: Handler = null

export function registerSettingsSave(handler: () => void) {
  saveHandler = handler
  return () => {
    if (saveHandler === handler) saveHandler = null
  }
}

export function registerSettingsReset(handler: () => void) {
  resetHandler = handler
  return () => {
    if (resetHandler === handler) resetHandler = null
  }
}

export function triggerSettingsSave() {
  saveHandler?.()
}

export function triggerSettingsReset() {
  resetHandler?.()
}
