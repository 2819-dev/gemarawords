const HEBREW_ATOM =
  /[\u0590-\u05FF\u05BE\u05F3\u05F4]/

export type MixedPart = {
  text: string
  hebrew: boolean
}

export function splitMixedText(text: string): MixedPart[] {
  const parts: MixedPart[] = []
  let buffer = ''
  let hebrew: boolean | null = null

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index] ?? ''
    const isHebrew = isHebrewChar(char)
    const keepHebrewSpace =
      hebrew === true && isSpace(char) && nextNonSpaceIsHebrew(text, index + 1)

    if (hebrew === null) {
      hebrew = isHebrew
      buffer = char
      continue
    }
    if (isHebrew === hebrew || keepHebrewSpace || (hebrew && isHebrewMark(char))) {
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

export function hasHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text)
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

function isSpace(char: string): boolean {
  return /\s/.test(char)
}

function nextNonSpaceIsHebrew(text: string, start: number): boolean {
  for (let index = start; index < text.length; index += 1) {
    const char = text[index] ?? ''
    if (isSpace(char)) {
      continue
    }
    return isHebrewChar(char) || isHebrewMark(char)
  }
  return false
}

function stripMarks(value: string): string {
  return value.normalize('NFC').replace(/[\u0591-\u05C7]/g, '').replace(/\s+/g, '')
}
