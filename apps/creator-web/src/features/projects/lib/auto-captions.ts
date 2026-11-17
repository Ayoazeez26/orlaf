/**
 * Languages Cloudflare Stream can transcribe into captions. Keep in sync with
 * AI_CAPTION_LANGUAGES in the backend's studio/captions.ts.
 */
const AUTO_CAPTION_LANGUAGES = new Set([
  "english",
  "french",
  "spanish",
  "portuguese",
  "german",
  "italian",
  "dutch",
  "polish",
  "czech",
  "russian",
  "japanese",
  "korean",
])

export function supportsAutoCaptions(language: string) {
  return AUTO_CAPTION_LANGUAGES.has(language.trim().toLowerCase())
}
