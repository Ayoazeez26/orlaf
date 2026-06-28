import {
  BlobSource,
  CanvasSink,
  Input,
  MATROSKA,
  MP4,
  QTFF,
  WEBM,
} from "mediabunny"
import { ensureMediabunnyCodecs } from "./register-codecs"
import type { ProbeMediaResult } from "./upload-pipeline.types"

const INPUT_FORMATS = [MP4, QTFF, WEBM, MATROSKA]

export async function probeMediaFile(file: File): Promise<ProbeMediaResult> {
  await ensureMediabunnyCodecs()

  const input = new Input({
    source: new BlobSource(file),
    formats: INPUT_FORMATS,
  })

  try {
    const durationSeconds = await input.computeDuration()
    const videoTrack = await input.getPrimaryVideoTrack()
    const audioTrack = await input.getPrimaryAudioTrack()

    let width: number | null = null
    let height: number | null = null
    let thumbnailObjectUrl: string | null = null

    if (videoTrack) {
      width = await videoTrack.getDisplayWidth()
      height = await videoTrack.getDisplayHeight()

      const sink = new CanvasSink(videoTrack, { poolSize: 1 })
      const wrapped = await sink.getCanvas(0)
      if (wrapped?.canvas) {
        const canvas = wrapped.canvas
        if (canvas instanceof HTMLCanvasElement) {
          thumbnailObjectUrl = await new Promise<string | null>((resolve) => {
            canvas.toBlob(
              (blob) => resolve(blob ? URL.createObjectURL(blob) : null),
              "image/jpeg",
              0.85
            )
          })
        }
      }
    }

    return {
      durationSeconds: Number.isFinite(durationSeconds)
        ? durationSeconds
        : null,
      width,
      height,
      hasVideo: videoTrack != null,
      hasAudio: audioTrack != null,
      thumbnailObjectUrl,
    }
  } finally {
    input.dispose()
  }
}
