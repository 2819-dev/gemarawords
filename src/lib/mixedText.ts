const HEBREW_ATOM = /[\u0590-\u05FF\u05BE\u05F3\u05F4]/

export type MixedPart = {
  text: string
  hebrew: boolean
}

export function splitMixedText(text: string): MixedPart[] {
  const parts: MixedPart[] = []
  let buffer = ''
  let hebrew: boolean | null = null

  for (const char of text) {
    const isHebrew = isHebrewChar(char) || isHebrewMark(char)
    if (hebrew === null) {
      hebrew = isHebrew
      buffer = char
      continue
    }
    if (isHebrew === hebrew) {
      buffer += char
      continue
    }
    parts.push({ text: buffer, hebrew })
    hebrew = isHebrew
    buffer = char
  }

  if (buffer && hebrew !== null) {
    parts.push({ text: buffer, hebrew })
  }

  return parts
}

export function hebrewRuns(text: string): string[] {
  return splitMixedText(text)
    .filter((part) => part.hebrew)
    .map((part) => part.text)
}

export function promptIncludesLemma(prompt: string, hebrew: string): boolean {
  const needle = stripMarks(hebrew)
  if (!needle) {
    return false
  }
  return stripMarks(prompt).includes(needle)
}

function isHebrewChar(char: string): boolean {
  return HEBREW_ATOM.test(char)
}

function isHebrewMark(char: string): boolean {
  return /[\u0591-\u05C7]/.test(char)
}

function stripMarks(value: string): string {
  return value.normalize('NFC').replace(/[\u0591-\u05C7]/g, '').replace(/\s+/g, '')
}
