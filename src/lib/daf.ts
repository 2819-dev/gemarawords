import { BM21B_ITEMS, BM21B_SUGYOS } from './packs/bm21b.ts'
import { BM45A_ITEMS, BM45A_SUGYOS } from './packs/bm45a.ts'
import type { Card, PackItem, Sugya, TranslationSource } from './types.ts'

export { DEFAULT_SENTENCE_PROMPT } from './packs/bm21b.ts'

export type DafPage = {
  id: string
  /** Card ids from this daf start with this prefix. */
  prefix: string
  ref: string
  lookupRef: string
  label: string
  hebrewLabel: string
  chapter: string
  available: boolean
  sugyos: Sugya[]
}

/** Sugya id for words the user pasted or uploaded themselves. */
export const CUSTOM_SUGYA = 'custom'

export const PAGES: DafPage[] = [
  {
    id: 'bava-metzia-45a',
    prefix: 'bm45a-',
    ref: 'Bava_Metzia.45a',
    lookupRef: 'Bava Metzia 45a',
    label: 'Bava Metzia 45a',
    hebrewLabel: 'בבא מציעא מ״ה ע״א',
    chapter: 'הזהב',
    available: true,
    sugyos: BM45A_SUGYOS,
  },
  {
    id: 'bava-metzia-21b',
    prefix: 'bm21b-',
    ref: 'Bava_Metzia.21b',
    lookupRef: 'Bava Metzia 21b',
    label: 'Bava Metzia 21b',
    hebrewLabel: 'בבא מציעא כ״א ע״ב',
    chapter: 'אלו מציאות',
    available: true,
    sugyos: BM21B_SUGYOS,
  },
]

export const DEFAULT_PAGE_ID = 'bava-metzia-45a'

const ITEMS: Record<string, PackItem[]> = {
  'bava-metzia-45a': BM45A_ITEMS,
  'bava-metzia-21b': BM21B_ITEMS,
}

export function pageById(pageId: string): DafPage | undefined {
  return PAGES.find((page) => page.id === pageId)
}

export function pageForCard(card: Pick<Card, 'id' | 'page'>): DafPage | undefined {
  if (card.page) {
    return pageById(card.page)
  }
  return PAGES.find((page) => card.id.startsWith(page.prefix))
}

export function sugyaOf(card: Pick<Card, 'sugya'>): string {
  return card.sugya ?? CUSTOM_SUGYA
}

function cardFromItem(pageId: string, item: PackItem): Card {
  return {
    ...item,
    page: pageId,
    weight: 1,
    consecutiveCorrect: 0,
    source: 'sefaria' as TranslationSource,
  }
}

export function buildDafPack(pageId: string): Card[] {
  return (ITEMS[pageId] ?? []).map((item) => cardFromItem(pageId, item))
}

export function mergeDafPack(existing: Card[], pack: Card[]): Card[] {
  const previous = new Map(existing.map((card) => [card.id, card]))
  return pack.map((card) => {
    const old = previous.get(card.id)
    if (!old) {
      return card
    }
    return {
      ...card,
      weight: old.weight,
      consecutiveCorrect: old.consecutiveCorrect,
    }
  })
}

/**
 * Refresh every daf already in the deck from the current packs (keeping scores),
 * drop cards a pack no longer has, and add any daf in `ensurePages`.
 */
export function refreshLoadedDeck(existing: Card[], ensurePages: string[] = []): Card[] {
  const loaded = new Set(ensurePages)
  for (const card of existing) {
    const page = pageForCard(card)
    if (page) {
      loaded.add(page.id)
    }
  }

  const fresh = new Map<string, Card>()
  for (const pageId of loaded) {
    for (const card of buildDafPack(pageId)) {
      fresh.set(card.id, card)
    }
  }

  const kept = existing
    .filter((card) => !pageForCard(card) || fresh.has(card.id))
    .map((card) => {
      const update = fresh.get(card.id)
      if (!update) {
        return card
      }
      return {
        ...update,
        weight: card.weight,
        consecutiveCorrect: card.consecutiveCorrect,
      }
    })
  const keptIds = new Set(kept.map((card) => card.id))
  return [...kept, ...[...fresh.values()].filter((card) => !keptIds.has(card.id))]
}

/** Cards shown for a daf: its own cards plus the user’s custom words. */
export function cardsForPage(cards: Card[], pageId: string): Card[] {
  return cards.filter((card) => {
    const page = pageForCard(card)
    return page ? page.id === pageId : true
  })
}

/** Cards that may come up in a round, given the chosen sugyos. */
export function studyPool(cards: Card[], pageId: string, sugyos: string[]): Card[] {
  const chosen = new Set(sugyos)
  return cardsForPage(cards, pageId).filter((card) => chosen.has(sugyaOf(card)))
}
