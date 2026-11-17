export type TranslationSource = 'sefaria' | 'machine' | 'manual' | 'none'

export type CardKind = 'word' | 'sentence' | 'question'

export type Card = {
  id: string
  kind: CardKind
  hebrew: string
  translation: string
  prompt?: string
  keywords?: string[]
  weight: number
  consecutiveCorrect: number
  source: TranslationSource
  /** Daf this card came from. Missing for words the user added. */
  page?: string
  /** Sugya (section) of the daf this card belongs to. */
  sugya?: string
}

export type PackItem = {
  id: string
  kind: CardKind
  hebrew: string
  translation: string
  prompt?: string
  keywords?: string[]
  sugya?: string
}

export type Sugya = {
  id: string
  title: string
  hebrew: string
  hint: string
}

export type TranslateResult = {
  word: string
  translation: string
  source: Exclude<TranslationSource, 'manual'>
}
