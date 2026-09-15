import { pickGloss } from './sefaria.ts'
import { normalizeWord } from './words.ts'
import type { TranslateResult } from './types.ts'

const BATCH_SIZE = 3
const FETCH_MS = 8000
const PREFIX = /^[ובכלמשהד]/

export type TranslateOptions = {
  lookupRef?: string
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'gemarawords/1.0',
    },
    signal: AbortSignal.timeout(FETCH_MS),
  })
  if (!response.ok) {
    throw new Error(`Lookup failed (${response.status})`)
  }
  return response.json()
}

function sefariaUrl(word: string, lookupRef: string | undefined, neverSplit: boolean): string {
  const params = new URLSearchParams({
    always_consonants: '1',
    never_split: neverSplit ? '1' : '0',
  })
  if (lookupRef) {
    params.set('lookup_ref', lookupRef)
  }
  return `https://www.sefaria.org/api/words/${encodeURIComponent(word)}?${params}`
}

async function fromSefaria(
  word: string,
  lookupRef: string | undefined,
  neverSplit: boolean,
): Promise<string> {
  const data = await fetchJson(sefariaUrl(word, lookupRef, neverSplit))
  return pickGloss(data)
}

function withoutPrefix(word: string): string {
  const plain = normalizeWord(word)
  if (plain.length < 4 || !PREFIX.test(plain)) {
    return ''
  }
  return plain.slice(1)
}

async function lookupTalmudic(word: string, lookupRef?: string): Promise<string> {
  const unique = [word]
  const stripped = withoutPrefix(word)
  if (stripped) {
    unique.push(stripped)
  }

  for (const candidate of unique) {
    try {
      const exact = await fromSefaria(candidate, lookupRef, true)
      if (exact) {
        return exact
      }
    } catch {
      // Try a looser lookup next.
    }
    if (/\s/.test(candidate)) {
      try {
        const split = await fromSefaria(candidate, lookupRef, false)
        if (split) {
          return split
        }
      } catch {
        // Continue.
      }
    }
  }

  return ''
}

async function translateOne(
  word: string,
  lookupRef?: string,
): Promise<TranslateResult> {
  try {
    const sefaria = await lookupTalmudic(word, lookupRef)
    if (sefaria) {
      return { word, translation: sefaria, source: 'sefaria' }
    }
  } catch {
    // Leave blank rather than using modern-Hebrew machine translation on Aramaic.
  }

  return { word, translation: '', source: 'none' }
}

export async function translateWords(
  words: string[],
  options: TranslateOptions = {},
): Promise<TranslateResult[]> {
  const results: TranslateResult[] = []
  for (let index = 0; index < words.length; index += BATCH_SIZE) {
    const batch = words.slice(index, index + BATCH_SIZE)
    results.push(
      ...(await Promise.all(
        batch.map((word) => translateOne(word, options.lookupRef)),
      )),
    )
  }
  return results
}
