import type { Card } from './types.ts'
import { stripNikkud } from './words.ts'

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'of',
  'to',
  'and',
  'or',
  'for',
  'on',
  'in',
  'at',
  'by',
  'from',
  'with',
  'as',
  'that',
  'this',
  'these',
  'those',
  'he',
  'she',
  'they',
  'them',
  'his',
  'her',
  'their',
  'we',
  'you',
  'so',
  'if',
  'when',
  'then',
  'but',
  'about',
  'into',
  'because',
  'while',
  'after',
  'before',
  'once',
  'just',
  'very',
  'more',
  'most',
  'some',
  'any',
  'all',
  'has',
  'have',
  'had',
  'already',
  'even',
  'still',
  'only',
  'own',
  'than',
  'also',
])

export type AnswerReason =
  | 'exact'
  | 'phrase'
  | 'keywords'
  | 'overlap'
  | 'yesno'
  | 'empty'
  | 'echo'
  | 'miss'

export type AnswerCheck = {
  correct: boolean
  reason: AnswerReason
}

export function questionFor(card: Card): string {
  if (card.prompt) {
    return card.prompt
  }
  if (card.kind === 'sentence') {
    return 'What is the Gemara saying here?'
  }
  return `What does ${card.hebrew} mean?`
}

export function normalizeAnswer(text: string): string {
  return stripNikkud(text)
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/'/g, '')
    .replace(/[^a-z0-9\u0590-\u05ff\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function checkAnswer(card: Card, raw: string): AnswerCheck {
  const user = normalizeAnswer(raw)
  if (!user) {
    return { correct: false, reason: 'empty' }
  }

  if (normalizeAnswer(card.hebrew) === user) {
    return { correct: false, reason: 'echo' }
  }

  const expected = normalizeAnswer(card.translation)
  const keywords = (card.keywords ?? []).map(normalizeAnswer).filter(Boolean)

  const userPolarity = polarity(user)
  const expectedPolarity = polarity(expected)
  if (userPolarity && expectedPolarity && userPolarity !== expectedPolarity) {
    return { correct: false, reason: 'miss' }
  }
  if (userPolarity && expectedPolarity && userPolarity === expectedPolarity) {
    return { correct: true, reason: 'yesno' }
  }

  if (user === expected) {
    return { correct: true, reason: 'exact' }
  }

  if (matchesHebrewInAnswer(card, user)) {
    return { correct: true, reason: 'phrase' }
  }

  if (isPhraseMatch(expected, user)) {
    return { correct: true, reason: 'phrase' }
  }

  if (keywords.some((keyword) => keywordHits(keyword, user))) {
    return { correct: true, reason: 'keywords' }
  }

  const expectedContent = contentTokens(expected)
  const userContent = contentTokens(user)
  const overlap = expectedContent.filter((token) =>
    userContent.some((piece) => tokensAlign(token, piece)),
  )

  if (overlap.length >= 2) {
    return { correct: true, reason: 'overlap' }
  }
  const distinctive = overlap[0]
  if (
    overlap.length === 1 &&
    distinctive &&
    (expectedContent.length <= 3 || distinctive.length >= 6)
  ) {
    return { correct: true, reason: 'overlap' }
  }

  return { correct: false, reason: 'miss' }
}

function matchesHebrewInAnswer(card: Card, user: string): boolean {
  if (!/[\u0590-\u05ff]/.test(user)) {
    return false
  }
  if (user === normalizeAnswer(card.hebrew)) {
    return false
  }
  const expected = normalizeAnswer(card.translation)
  return expected === user || hasPhrase(expected, user)
}
function polarity(text: string): 'yes' | 'no' | null {
  if (/^(yes|yeah|yep|yea)\b/.test(text)) {
    return 'yes'
  }
  if (/^(no|nope)\b/.test(text)) {
    return 'no'
  }
  return null
}

function isPhraseMatch(expected: string, user: string): boolean {
  const userTokens = user.split(' ').filter(Boolean)
  if (user.length < 3) {
    return false
  }
  if (hasPhrase(expected, user)) {
    return userTokens.length >= 2 || user.length >= 6
  }
  return user.length >= 12 && hasPhrase(user, expected)
}

function hasPhrase(haystack: string, needle: string): boolean {
  return ` ${haystack} `.includes(` ${needle} `)
}

function keywordHits(keyword: string, user: string): boolean {
  if (keyword === user) {
    return true
  }
  if (keyword.length >= 3 && hasPhrase(user, keyword)) {
    return true
  }
  if (user.length >= 4 && hasPhrase(keyword, user)) {
    return true
  }
  return keyword.length >= 6 && user.includes(keyword)
}

function contentTokens(text: string): string[] {
  return text
    .split(' ')
    .filter(Boolean)
    .filter(
      (token) =>
        !STOP_WORDS.has(token) &&
        (token.length >= 3 || token === 'no' || token === 'yes' || token === 'is'),
    )
}

function tokensAlign(expected: string, user: string): boolean {
  if (expected === user) {
    return true
  }
  return (
    expected.length >= 4 &&
    user.length >= 4 &&
    (expected.includes(user) || user.includes(expected))
  )
}
