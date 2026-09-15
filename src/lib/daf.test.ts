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
    expect(pack.some((card) => card.kind === 'question' && card.prompt?.includes('יֵאוּשׁ'))).toBe(
      true,
    )
    expect(
      pack
        .filter((card) => card.kind === 'question')
        .every((card) => card.prompt && /[\u0590-\u05FF]/.test(card.prompt)),
    ).toBe(true)
    expect(pack.some((card) => /unconscious/i.test(card.translation))).toBe(false)
    const shelo = pack.find((card) => card.hebrew === 'יֵאוּשׁ שֶׁלֹּא מִדַּעַת')
    expect(shelo?.translation).toMatch(/Giving up hope without knowledge/i)
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

  it('drops old pack cards and refreshes the answers', () => {
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
        translation: 'old modern gloss',
        keywords: undefined,
        weight: 9,
      },
    ]
    const refreshed = refreshLoadedDeck(stale)
    expect(refreshed.some((card) => card.id === 'bm21b-w-ta')).toBe(false)
    const first = refreshed.find((card) => card.id === pack[0]?.id)
    expect(first?.weight).toBe(9)
    expect(first?.translation).toBe(pack[0]?.translation)
    expect(first?.keywords?.length).toBeGreaterThan(0)
    expect(refreshed.length).toBeGreaterThanOrEqual(pack.length)
  })
})
