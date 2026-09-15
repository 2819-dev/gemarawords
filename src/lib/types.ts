export type TranslationSource = 'sefaria' | 'machine' | 'manual' | 'none'

export type Card = {
  id: string
  hebrew: string
  translation: string
  weight: number
  consecutiveCorrect: number
  source: TranslationSource
}

export type TranslateResult = {
  word: string
  translation: string
  source: Exclude<TranslationSource, 'manual'>
}
