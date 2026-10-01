export interface GuidelinesBlock {
  type: "heading" | "paragraph"
  text: string
}

/** Splits on blank lines; a block starting with "## " renders as a heading. */
export function parseGuidelinesContent(content: string): GuidelinesBlock[] {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      block.startsWith("## ")
        ? { type: "heading" as const, text: block.slice(3).trim() }
        : { type: "paragraph" as const, text: block }
    )
}
