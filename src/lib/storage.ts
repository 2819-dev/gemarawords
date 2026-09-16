import type { Card } from './types.ts'
import { padExamAnswers, type ExamDraft, type ExamResult } from './exam.ts'
import type { RoundSummary } from './session.ts'

const STORAGE_KEY = 'gemara-words-deck-v2'
const ROUND_KEY = 'gemara-words-last-round-v1'
const EXAM_KEY = 'gemara-words-exam-v1'
const EXAM_DRAFT_KEY = 'gemara-words-exam-draft-v1'
const NAME_KEY = 'gemara-words-student-name-v1'

function isCard(value: unknown): value is Card {
  if (!value || typeof value !== 'object') {
    return false
  }
  const card = value as Record<string, unknown>
  const kind = card.kind ?? 'word'
  return (
    typeof card.id === 'string' &&
    typeof card.hebrew === 'string' &&
    typeof card.translation === 'string' &&
    typeof card.weight === 'number' &&
    typeof card.consecutiveCorrect === 'number' &&
    (kind === 'word' || kind === 'sentence' || kind === 'question') &&
    (card.source === 'sefaria' ||
      card.source === 'machine' ||
      card.source === 'manual' ||
      card.source === 'none')
  )
}

export function loadDeck(): Card[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isCard).map((card) => ({
      ...card,
      kind: card.kind ?? 'word',
    }))
  } catch {
    return []
  }
}

export function saveDeck(cards: Card[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export function loadLastRound(): RoundSummary | null {
  try {
    const raw = localStorage.getItem(ROUND_KEY)
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }
    const row = parsed as Record<string, unknown>
    if (
      typeof row.correct !== 'number' ||
      typeof row.reviewed !== 'number' ||
      typeof row.solidGained !== 'number' ||
      typeof row.bestStreak !== 'number' ||
      typeof row.complete !== 'boolean'
    ) {
      return null
    }
    return {
      correct: row.correct,
      reviewed: row.reviewed,
      solidGained: row.solidGained,
      bestStreak: row.bestStreak,
      complete: row.complete,
    }
  } catch {
    return null
  }
}

export function saveLastRound(summary: RoundSummary): void {
  localStorage.setItem(ROUND_KEY, JSON.stringify(summary))
}

export function loadStudentName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveStudentName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}

export function loadLastExam(): ExamResult | null {
  try {
    const raw = localStorage.getItem(EXAM_KEY)
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }
    const row = parsed as Record<string, unknown>
    if (
      typeof row.name !== 'string' ||
      typeof row.takenAt !== 'string' ||
      typeof row.minutes !== 'number' ||
      typeof row.correct !== 'number' ||
      typeof row.total !== 'number' ||
      typeof row.percent !== 'number' ||
      typeof row.passed !== 'boolean' ||
      typeof row.honor !== 'string' ||
      !Array.isArray(row.items)
    ) {
      return null
    }
    return parsed as ExamResult
  } catch {
    return null
  }
}

export function saveLastExam(result: ExamResult): void {
  localStorage.setItem(EXAM_KEY, JSON.stringify(result))
  if (result.name.trim()) {
    saveStudentName(result.name)
  }
}

export function loadExamDraft(): ExamDraft | null {
  try {
    const raw = localStorage.getItem(EXAM_DRAFT_KEY)
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }
    const row = parsed as Record<string, unknown>
    if (!Array.isArray(row.answers) || typeof row.startedAt !== 'number') {
      return null
    }
    return {
      answers: padExamAnswers(row.answers.map((item) => String(item))),
      startedAt: row.startedAt,
    }
  } catch {
    return null
  }
}

export function saveExamDraft(draft: ExamDraft): void {
  localStorage.setItem(EXAM_DRAFT_KEY, JSON.stringify(draft))
}

export function clearExamDraft(): void {
  localStorage.removeItem(EXAM_DRAFT_KEY)
}

export function clearDeckStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(ROUND_KEY)
}
