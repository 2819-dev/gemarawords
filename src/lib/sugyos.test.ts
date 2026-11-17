import { describe, expect, it } from 'vitest'
import { checkAnswer } from './answer.ts'
import {
  buildDafPack,
  CUSTOM_SUGYA,
  DEFAULT_PAGE_ID,
  PAGES,
  refreshLoadedDeck,
  studyPool,
} from './daf.ts'
import { examCard, examFor, gradeExam, parseAnswerSheet } from './exam.ts'
import { BM21B_ITEMS, sugyaFor21b } from './packs/bm21b.ts'
import type { Card } from './types.ts'

const HEBREW = /[֐-׿]/

it('opens on 25a', () => {
  expect(DEFAULT_PAGE_ID).toBe('bava-metzia-25a')
})

describe.each([
  ['bava-metzia-25a', 'bm25a-', 'כְּלִי וּלְפָנָיו פֵּירוֹת'],
  ['bava-metzia-45a', 'bm45a-', 'דִּינָר בְּדִינָר'],
])('%s pack', (pageId, prefix, phrase) => {
  const page = PAGES.find((item) => item.id === pageId)!
  const pack = buildDafPack(pageId)

  it('is split into sugyos', () => {
    expect(page.available).toBe(true)
    expect(page.sugyos.length).toBeGreaterThanOrEqual(3)
    const sugyaIds = new Set(page.sugyos.map((sugya) => sugya.id))
    expect(pack.every((card) => card.sugya && sugyaIds.has(card.sugya))).toBe(true)
    expect(pack.every((card) => card.page === pageId)).toBe(true)
    for (const sugya of page.sugyos) {
      const kinds = new Set(pack.filter((card) => card.sugya === sugya.id).map((card) => card.kind))
      expect([...kinds].sort()).toEqual(['question', 'sentence', 'word'])
    }
  })

  it('has unique ids and English answers', () => {
    expect(new Set(pack.map((card) => card.id)).size).toBe(pack.length)
    expect(pack.every((card) => card.id.startsWith(prefix))).toBe(true)
    expect(pack.every((card) => !HEBREW.test(card.translation))).toBe(true)
    expect(
      pack.filter((card) => card.kind === 'sentence').every((card) => /english/i.test(card.prompt ?? '')),
    ).toBe(true)
    expect(pack.some((card) => card.hebrew.includes(phrase))).toBe(true)
  })

  it('grades each card’s own answer as correct', () => {
    for (const card of pack) {
      expect(checkAnswer(card, card.translation).correct, card.id).toBe(true)
    }
  })
})

describe('21b sugyos', () => {
  it('assigns every 21b card to a sugya on purpose', () => {
    expect(BM21B_ITEMS.every((item) => sugyaFor21b(item.id))).toBe(true)
  })
})

describe('choosing sugyos', () => {
  const custom: Card = {
    id: 'שקל',
    kind: 'word',
    hebrew: 'שקל',
    translation: 'shekel',
    weight: 1,
    consecutiveCorrect: 0,
    source: 'manual',
  }
  const deck = refreshLoadedDeck([custom], ['bava-metzia-45a', 'bava-metzia-21b'])

  it('only asks on the chosen sugyos of the chosen daf', () => {
    const pool = studyPool(deck, 'bava-metzia-45a', ['perutos'])
    expect(pool.length).toBeGreaterThan(0)
    expect(pool.every((card) => card.sugya === 'perutos' && card.page === 'bava-metzia-45a')).toBe(
      true,
    )
    expect(studyPool(deck, 'bava-metzia-45a', [])).toEqual([])
  })

  it('treats pasted words as their own section', () => {
    expect(studyPool(deck, 'bava-metzia-45a', [CUSTOM_SUGYA])).toEqual([custom])
  })

  it('adds a new daf to an old 21b deck without losing scores', () => {
    const old = buildDafPack('bava-metzia-21b').map((card, index) => {
      const { page: _page, sugya: _sugya, ...rest } = card
      return index === 0 ? { ...rest, weight: 9 } : rest
    })
    const refreshed = refreshLoadedDeck(old, ['bava-metzia-45a'])
    expect(refreshed.find((card) => card.id === old[0]?.id)?.weight).toBe(9)
    expect(refreshed.find((card) => card.id === old[0]?.id)?.sugya).toBeTruthy()
    expect(refreshed.some((card) => card.page === 'bava-metzia-45a')).toBe(true)
  })
})

describe('per-daf bechina', () => {
  it('builds the 45a bechina from the chosen sugyos', () => {
    const full = examFor('bava-metzia-45a')
    expect(full.questions.length).toBeGreaterThanOrEqual(8)
    expect(full.title).toBe('Bava Metzia 45a')
    const part = examFor('bava-metzia-45a', ['dinar'])
    expect(part.sections.map((section) => section.id)).toEqual(['dinar'])
    expect(part.questions.every((question) => question.sectionId === 'dinar')).toBe(true)
    expect(part.questions.length).toBeLessThan(full.questions.length)
  })

  it.each(['bava-metzia-25a', 'bava-metzia-45a'])('scores a full %s answer sheet', (pageId) => {
    const exam = examFor(pageId)
    expect(exam.questions.length).toBeGreaterThanOrEqual(8)
    expect(new Set(exam.questions.map((question) => question.sectionId))).toEqual(
      new Set(PAGES.find((page) => page.id === pageId)!.sugyos.map((sugya) => sugya.id)),
    )
    for (const question of exam.questions) {
      expect(checkAnswer(examCard(question), question.translation).correct, question.id).toBe(true)
    }
    const result = gradeExam(
      exam.questions.map((question) => question.translation),
      'Hillel',
      10,
      undefined,
      exam,
    )
    expect(result.percent).toBe(100)
    expect(result.pageId).toBe(pageId)
    expect(result.chapter).toBe(PAGES.find((page) => page.id === pageId)!.chapter)
    expect(parseAnswerSheet('1. a\n3. c', exam.questions.length)).toHaveLength(exam.questions.length)
  })
})
