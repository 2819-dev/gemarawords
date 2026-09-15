import type { Card } from './types.ts'

export const MAX_WEIGHT = 16
export const WEIGHT_MULTIPLIER = 3
export const MASTER_STREAK = 2

export function gradeCard(card: Card, correct: boolean): Card {
  if (!correct) {
    return {
      ...card,
      consecutiveCorrect: 0,
      weight: Math.min(card.weight * WEIGHT_MULTIPLIER, MAX_WEIGHT),
    }
  }

  const consecutiveCorrect = card.consecutiveCorrect + 1
  return {
    ...card,
    consecutiveCorrect,
    weight: consecutiveCorrect >= MASTER_STREAK ? 1 : card.weight,
  }
}

export function pickNextCard(
  cards: Card[],
  lastId: string | null,
  random: () => number = Math.random,
): Card | undefined {
  if (cards.length === 0) {
    return undefined
  }

  const pool =
    cards.length > 1 && lastId
      ? cards.filter((card) => card.id !== lastId)
      : cards

  const total = pool.reduce((sum, card) => sum + card.weight, 0)
  let ticket = random() * total

  for (const card of pool) {
    ticket -= card.weight
    if (ticket <= 0) {
      return card
    }
  }

  return pool[pool.length - 1]
}
