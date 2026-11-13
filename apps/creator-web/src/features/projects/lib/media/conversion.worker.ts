import { registerAacEncoder } from "@mediabunny/aac-encoder"
import {
  BlobSource,
  BufferTarget,
  Conversion,
  canEncodeAudio,
  Input,
  MATROSKA,
  MP4,
  Mp4OutputFormat,
  Output,
  QTFF,
  QUALITY_HIGH,
  QUALITY_MEDIUM,
  WEBM,
} from "mediabunny"

const INPUT_FORMATS = [MP4, QTFF, WEBM, MATROSKA]

export interface WorkerConvertRequest {
  type: "convert"
  fileBuffer: ArrayBuffer
  fileName: string
  aiVerticalConversion: boolean
}

export interface WorkerProgressMessage {
  type: "progress"
  value: number
}

export interface WorkerDoneMessage {
  type: "done"
  buffer: ArrayBuffer
  durationSeconds: number | null
  width: number | null
  height: number | null
}

export interface WorkerErrorMessage {
  type: "error"
  message: string
}

export type WorkerOutMessage =
  | WorkerProgressMessage
  | WorkerDoneMessage
  | WorkerErrorMessage

let codecsReady: Promise<void> | null = null

async function ensureCodecs() {
  if (!codecsReady) {
    codecsReady = (async () => {
      if (!(await canEncodeAudio("aac"))) {
        registerAacEncoder()
      }
    })()
  }
  return codecsReady
}

self.onmessage = async (event: MessageEvent<WorkerConvertRequest>) => {
  if (event.data.type !== "convert") return

  const { fileBuffer, fileName, aiVerticalConversion } = event.data
  let input: Input | null = null

  try {
    await ensureCodecs()

    const blob = new Blob([fileBuffer], { type: "application/octet-stream" })
    const file = new File([blob], fileName, { type: blob.type })

    input = new Input({
      source: new BlobSource(file),
      formats: INPUT_FORMATS,
    })

    const sourceAudioTrack = await input.getPrimaryAudioTrack()
    const hadSourceAudio = sourceAudioTrack != null

    const output = new Output({
      format: new Mp4OutputFormat(),
      target: new BufferTarget(),
    })

    // Some browsers (notably iOS Safari) expose no WebCodecs AudioDecoder, or
    // one that rejects the source codec, so a forced transcode discards the
    // audio as `undecodable_source_codec`. When MP4 can hold the source codec
    // as-is, copy its packets through untouched instead — Cloudflare Stream
    // transcodes the audio server-side anyway. Vorbis is excluded: it is
    // non-standard in MP4 and would only fail later, server-side.
    const sourceAudioCodec = await sourceAudioTrack?.getCodec()
    const passThroughAudio =
      sourceAudioTrack != null &&
      sourceAudioCodec != null &&
      sourceAudioCodec !== "vorbis" &&
      output.format.getSupportedAudioCodecs().includes(sourceAudioCodec) &&
      !(await sourceAudioTrack.canDecode())

    // Compressed audio usually carries encoder-priming packets with negative
    // timestamps. Mediabunny trims those by default, and trimming requires
    // decoding — which would block the pass-through. Starting the timeline at
    // the earliest packet keeps every track intact and in sync.
    const trim = passThroughAudio
      ? { start: Math.min(0, await input.getFirstTimestamp()) }
      : undefined

    const conversion = await Conversion.init({
      input,
      output,
      trim,
      video: aiVerticalConversion
        ? {
            codec: "avc",
            width: 1080,
            height: 1920,
            fit: "cover",
            bitrate: QUALITY_HIGH,
          }
        : {
            codec: "avc",
            bitrate: QUALITY_HIGH,
          },
      audio: passThroughAudio
        ? {}
        : {
            codec: "aac",
            bitrate: QUALITY_MEDIUM,
            // Force every source (regardless of its original sample rate or
            // channel layout) onto a config the registered AAC fallback
            // encoder is guaranteed to support, instead of inheriting the
            // source's config and silently failing `AacEncoder.supports()`.
            sampleRate: 48000,
            numberOfChannels: 2,
            forceTranscode: true,
          },
    })

    if (!conversion.isValid) {
      const reasons = conversion.discardedTracks
        .map((track) => track.reason)
        .join("; ")
      throw new Error(
        reasons
          ? `Conversion not possible: ${reasons}`
          : "Conversion not possible for this file"
      )
    }

    const discardedAudioTrack = conversion.discardedTracks.find(
      (discarded) => discarded.track.type === "audio"
    )
    if (hadSourceAudio && discardedAudioTrack) {
      throw new Error(
        `Audio could not be converted (${discardedAudioTrack.reason}). Try re-exporting the video and uploading again.`
      )
    }

    conversion.onProgress = (value: number) => {
      const message: WorkerProgressMessage = { type: "progress", value }
      self.postMessage(message)
    }

    await conversion.execute()

    const buffer = output.target.buffer
    if (!buffer) {
      throw new Error("Conversion produced no output")
    }

    const durationSeconds = await input.computeDuration()
    const videoTrack = await input.getPrimaryVideoTrack()
    let width: number | null = null
    let height: number | null = null
    if (videoTrack) {
      width = await videoTrack.getDisplayWidth()
      height = await videoTrack.getDisplayHeight()
    }

    const done: WorkerDoneMessage = {
      type: "done",
      buffer,
      durationSeconds: Number.isFinite(durationSeconds)
        ? durationSeconds
        : null,
      width,
      height,
    }

    self.postMessage(done, { transfer: [buffer] })
  } catch (error) {
    const message: WorkerErrorMessage = {
      type: "error",
      message: error instanceof Error ? error.message : "Conversion failed",
    }
    self.postMessage(message)
  } finally {
    input?.dispose()
  }
}
