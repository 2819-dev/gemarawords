import type { Card } from './types.ts'

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

export function createCard(hebrew: string): Card {
  return {
    id: normalizeWord(hebrew),
    hebrew,
    translation: '',
    weight: 1,
    consecutiveCorrect: 0,
    source: 'none',
  }
}

export function addWordsToDeck(
  existing: Card[],
  input: string,
): { cards: Card[]; added: Card[]; skipped: number } {
  const existingIds = new Set(existing.map((card) => card.id))
  const seen = new Set(existingIds)
  const added: Card[] = []
  let skipped = 0

  for (const token of collectTokens(input)) {
    const id = normalizeWord(token)
    if (!id) {
      continue
    }
    if (seen.has(id)) {
      skipped += 1
      continue
    }
    seen.add(id)
    added.push(createCard(token))
  }

  return {
    cards: [...existing, ...added],
    added,
    skipped,
  }
}
