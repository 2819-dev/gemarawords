export type TranslationSource = 'sefaria' | 'machine' | 'manual' | 'none'

export type CardKind = 'word' | 'sentence' | 'question'

export type Card = {
  id: string
  kind: CardKind
  hebrew: string
  translation: string
  prompt?: string
  weight: number
  consecutiveCorrect: number
  source: TranslationSource
}

export type TranslateResult = {
  word: string
  translation: string
  source: Exclude<TranslationSource, 'manual'>
}
