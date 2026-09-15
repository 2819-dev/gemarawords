import type { Card } from './types.ts'

export type WordEntry = {
  hebrew: string
  translation?: string
}

export type DeckUpdate = {
  cards: Card[]
  added: Card[]
  skipped: number
}

const NIKKUD = /[\u0591-\u05C7]/g
const EDGE_PUNCT = /^[,.;:]+|[,.;:]+$/g

export function stripNikkud(value: string): string {
  return value.normalize('NFC').replace(NIKKUD, '')
}

export function normalizeWord(value: string): string {
  return stripNikkud(value).replace(EDGE_PUNCT, '').trim()
}

export function collectTokens(input: string): string[] {
  return input
    .split(/\s+/)
    .map((token) => token.trim().replace(EDGE_PUNCT, ''))
    .filter(Boolean)
}

export function createCard(hebrew: string, translation?: string): Card {
  const trimmed = typeof translation === 'string' ? translation.trim() : ''
  return {
    id: normalizeWord(hebrew),
    hebrew,
    translation: trimmed,
    weight: 1,
    consecutiveCorrect: 0,
    source: trimmed ? 'manual' : 'none',
  }
}

export function addEntriesToDeck(
  existing: Card[],
  entries: WordEntry[],
): DeckUpdate {
  const existingIds = new Set(existing.map((card) => card.id))
  const seen = new Set(existingIds)
  const added: Card[] = []
  let skipped = 0

  for (const entry of entries) {
    const hebrew = entry.hebrew.trim().replace(EDGE_PUNCT, '')
    const id = normalizeWord(hebrew)
    if (!id) {
      continue
    }
    if (seen.has(id)) {
      skipped += 1
      continue
    }
    seen.add(id)
    added.push(createCard(hebrew, entry.translation ?? ''))
  }

  return {
    cards: [...existing, ...added],
    added,
    skipped,
  }
}

export function addWordsToDeck(existing: Card[], input: string): DeckUpdate {
  return addEntriesToDeck(
    existing,
    collectTokens(input).map((hebrew) => ({ hebrew })),
  )
}
