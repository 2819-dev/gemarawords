import { describe, expect, it } from 'vitest'
import { addWordsToDeck, collectTokens, normalizeWord } from './words.ts'

describe('normalizeWord', () => {
  it('treats nikkud and plain consonants as the same word', () => {
    expect(normalizeWord('שָׁלוֹם')).toBe(normalizeWord('שלום'))
  })

  it('trims ASCII punctuation from the edges', () => {
    expect(normalizeWord('אמר,')).toBe('אמר')
  })
})

describe('addWordsToDeck', () => {
  it('splits on whitespace and keeps unique words', () => {
    const { added, skipped, cards } = addWordsToDeck([], 'אמר\nרבי אמר')
    expect(collectTokens('אמר\nרבי אמר')).toEqual(['אמר', 'רבי', 'אמר'])
    expect(added.map((card) => card.hebrew)).toEqual(['אמר', 'רבי'])
    expect(skipped).toBe(1)
    expect(cards).toHaveLength(2)
  })

  it('does not add a word already in the deck or reset its score', () => {
    const existing = addWordsToDeck([], 'אמר').cards
    existing[0] = { ...existing[0], translation: 'said', weight: 9, consecutiveCorrect: 1 }

    const result = addWordsToDeck(existing, 'אמר רבא')
    expect(result.skipped).toBe(1)
    expect(result.added).toHaveLength(1)
    expect(result.added[0]?.hebrew).toBe('רבא')
    expect(result.cards[0]?.weight).toBe(9)
    expect(result.cards[0]?.translation).toBe('said')
  })

  it('counts a nikkud duplicate as skipped', () => {
    const first = addWordsToDeck([], 'שלום')
    const second = addWordsToDeck(first.cards, 'שָׁלוֹם')
    expect(second.added).toHaveLength(0)
    expect(second.skipped).toBe(1)
  })
})
