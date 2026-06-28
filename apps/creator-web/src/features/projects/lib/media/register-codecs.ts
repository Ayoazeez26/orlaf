import { registerAacEncoder } from "@mediabunny/aac-encoder"
import { canEncodeAudio } from "mediabunny"

let registered = false

export async function ensureMediabunnyCodecs(): Promise<void> {
  if (registered) return

  if (!(await canEncodeAudio("aac"))) {
    registerAacEncoder()
  }

  registered = true
}
