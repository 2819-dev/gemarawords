import { describe, expect, it } from 'vitest'
import { buildDafPack, mergeDafPack, PAGES, refreshLoadedDeck } from './daf.ts'
import type { Card } from './types.ts'

describe('Bava Metzia 21b pack', () => {
  it('exposes 21b as the available page', () => {
    expect(PAGES.some((page) => page.id === 'bava-metzia-21b' && page.available)).toBe(true)
  })

  it('mixes words, sentences, and questions', () => {
    const pack = buildDafPack('bava-metzia-21b')
    const kinds = new Set(pack.map((card) => card.kind))
    expect(kinds.has('word')).toBe(true)
    expect(kinds.has('sentence')).toBe(true)
    expect(kinds.has('question')).toBe(true)
    expect(pack.some((card) => card.hebrew.includes('לֵית'))).toBe(true)
    expect(pack.some((card) => card.hebrew === 'הָוֵי')).toBe(true)
    expect(pack.some((card) => card.hebrew === 'תָּא שְׁמַע')).toBe(true)
    expect(pack.some((card) => card.hebrew === 'תָּא')).toBe(false)
    expect(pack.some((card) => card.hebrew === 'עָלְמָא')).toBe(false)
    expect(pack.some((card) => card.kind === 'question' && card.prompt?.includes('shelo'))).toBe(
      true,
    )
    expect(new Set(pack.map((card) => card.id)).size).toBe(pack.length)
  })

  it('keeps scores when the same daf is loaded again', () => {
    const pack = buildDafPack('bava-metzia-21b')
    const studied = pack.map((card, index) =>
      index === 0 ? { ...card, weight: 9, consecutiveCorrect: 0 } : card,
    )
    const merged = mergeDafPack(studied, pack)
    expect(merged[0]?.weight).toBe(9)
    expect(merged[1]?.weight).toBe(1)
  })

  it('drops fragment cards and copies keywords onto a saved deck', () => {
    const pack = buildDafPack('bava-metzia-21b')
    const stale: Card[] = [
      {
        id: 'bm21b-w-ta',
        kind: 'word',
        hebrew: 'תָּא',
        translation: 'come',
        weight: 3,
        consecutiveCorrect: 0,
        source: 'sefaria',
      },
      {
        ...pack[0]!,
        keywords: undefined,
        weight: 9,
      },
    ]
    const refreshed = refreshLoadedDeck(stale)
    expect(refreshed.some((card) => card.id === 'bm21b-w-ta')).toBe(false)
    expect(refreshed[0]?.weight).toBe(9)
    expect(refreshed[0]?.keywords?.length).toBeGreaterThan(0)
  })
})
