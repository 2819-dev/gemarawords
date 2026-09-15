import { pickGloss } from './sefaria.ts'
import type { TranslateResult } from './types.ts'

const BATCH_SIZE = 3
const FETCH_MS = 8000

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

async function fromSefaria(word: string): Promise<string> {
  const url = `https://www.sefaria.org/api/words/${encodeURIComponent(word)}?never_split=1`
  const data = await fetchJson(url)
  return pickGloss(data)
}

async function fromMachine(word: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=he|en`
  const data = await fetchJson(url)
  const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : null
  const responseData =
    record && typeof record.responseData === 'object' && record.responseData
      ? (record.responseData as Record<string, unknown>)
      : null
  const text =
    typeof responseData?.translatedText === 'string'
      ? responseData.translatedText.trim()
      : ''
  if (!text || text.toLowerCase() === word.toLowerCase()) {
    return ''
  }
  return text
}

async function translateOne(word: string): Promise<TranslateResult> {
  try {
    const sefaria = await fromSefaria(word)
    if (sefaria) {
      return { word, translation: sefaria, source: 'sefaria' }
    }
  } catch {
    // Fall through to machine translation.
  }

  try {
    const machine = await fromMachine(word)
    if (machine) {
      return { word, translation: machine, source: 'machine' }
    }
  } catch {
    // Leave blank so the learner can type a gloss.
  }

  return { word, translation: '', source: 'none' }
}

export async function translateWords(words: string[]): Promise<TranslateResult[]> {
  const results: TranslateResult[] = []
  for (let index = 0; index < words.length; index += BATCH_SIZE) {
    const batch = words.slice(index, index + BATCH_SIZE)
    results.push(...(await Promise.all(batch.map(translateOne))))
  }
  return results
}
