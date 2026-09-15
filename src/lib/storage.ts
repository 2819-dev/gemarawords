import type { Card } from './types.ts'

const STORAGE_KEY = 'gemara-words-deck-v1'

function isCard(value: unknown): value is Card {
  if (!value || typeof value !== 'object') {
    return false
  }
  const card = value as Record<string, unknown>
  return (
    typeof card.id === 'string' &&
    typeof card.hebrew === 'string' &&
    typeof card.translation === 'string' &&
    typeof card.weight === 'number' &&
    typeof card.consecutiveCorrect === 'number' &&
    (card.source === 'sefaria' ||
      card.source === 'machine' ||
      card.source === 'manual' ||
      card.source === 'none')
  )
}

export function loadDeck(): Card[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isCard)
  } catch {
    return []
  }
}

export function saveDeck(cards: Card[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export function clearDeckStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
