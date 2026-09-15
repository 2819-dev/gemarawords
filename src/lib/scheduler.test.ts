import { describe, expect, it } from 'vitest'
import { gradeCard, MAX_WEIGHT, pickNextCard } from './scheduler.ts'
import { createCard } from './words.ts'

describe('gradeCard', () => {
  it('raises weight after an incorrect answer', () => {
    const card = createCard('אמר')
    const missed = gradeCard(card, false)
    expect(missed.consecutiveCorrect).toBe(0)
    expect(missed.weight).toBe(3)
  })

  it('caps weight so one word cannot dominate forever', () => {
    let card = createCard('אמר')
    for (let i = 0; i < 8; i += 1) {
      card = gradeCard(card, false)
    }
    expect(card.weight).toBe(MAX_WEIGHT)
  })

  it('returns to normal random weight after two consecutive corrects', () => {
    const missed = gradeCard(createCard('אמר'), false)
    const firstCorrect = gradeCard(missed, true)
    expect(firstCorrect.weight).toBe(3)
    const secondCorrect = gradeCard(firstCorrect, true)
    expect(secondCorrect.weight).toBe(1)
    expect(secondCorrect.consecutiveCorrect).toBe(2)
  })
})

describe('pickNextCard', () => {
  it('never repeats the previous card when another card exists', () => {
    const cards = ['אמר', 'רבי', 'תנן'].map(createCard)
    for (let i = 0; i < 20; i += 1) {
      const next = pickNextCard(cards, 'אמר', () => i / 20)
      expect(next?.id).not.toBe(normalizeId('אמר'))
    }
  })

  it('prefers higher-weight missed cards', () => {
    const known = { ...createCard('רבי'), weight: 1 }
    const missed = { ...createCard('אמר'), weight: 16 }
    const next = pickNextCard([known, missed], null, () => 0.5)
    expect(next?.id).toBe(missed.id)
  })

  it('does not walk the list in input order', () => {
    const cards = ['א', 'ב', 'ג', 'ד'].map(createCard)
    const order = [
      pickNextCard(cards, null, () => 0.9)?.hebrew,
      pickNextCard(cards, null, () => 0.1)?.hebrew,
      pickNextCard(cards, null, () => 0.6)?.hebrew,
    ]
    expect(order).not.toEqual(['א', 'ב', 'ג'])
  })
})

function normalizeId(value: string): string {
  return createCard(value).id
}
