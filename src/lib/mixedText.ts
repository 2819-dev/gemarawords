const HEBREW_ATOM = /[\u0590-\u05FF\u05BE\u05F3\u05F4]/

export type MixedPart = {
  text: string
  hebrew: boolean
}

export type MixedGroup =
  | { hebrew: false; text: string }
  | { hebrew: true; words: string[] }

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

export function groupMixedParts(text: string): MixedGroup[] {
  const parts = splitMixedText(text)
  const groups: MixedGroup[] = []
  let index = 0

  while (index < parts.length) {
    const part = parts[index]
    if (!part) {
      break
    }
    if (!part.hebrew) {
      groups.push({ hebrew: false, text: part.text })
      index += 1
      continue
    }

    const words = [part.text]
    index += 1
    while (index < parts.length) {
      const gap = parts[index]
      const next = parts[index + 1]
      if (gap && !gap.hebrew && gap.text.trim() === '' && next?.hebrew) {
        words.push(next.text)
        index += 2
        continue
      }
      break
    }
    groups.push({ hebrew: true, words })
  }

  return groups
}

const LRI = '\u2066'
const RLI = '\u2067'
const PDI = '\u2069'
const LRM = '\u200E'

export function embedHebrewPhrase(words: string[]): string {
  return `${LRI}${words.map((word) => `${RLI}${word}${PDI}`).join(`${LRM} `)}${PDI}${LRM}`
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
