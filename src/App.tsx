import { useCallback, useEffect, useMemo, useState } from 'react'
import { CertificateScreen } from './components/CertificateScreen.tsx'
import { DeckScreen } from './components/DeckScreen.tsx'
import { ExamResultScreen } from './components/ExamResultScreen.tsx'
import { ExamScreen } from './components/ExamScreen.tsx'
import { RecapScreen } from './components/RecapScreen.tsx'
import { StudyScreen } from './components/StudyScreen.tsx'
import { buildDafPack, PAGES, refreshLoadedDeck } from './lib/daf.ts'
import { gradeExam, type ExamResult } from './lib/exam.ts'
import { gradeCard, MASTER_STREAK, pickNextCard } from './lib/scheduler.ts'
import { parseSpreadsheetFile } from './lib/spreadsheet.ts'
import { ROUND_SIZE, emptyRound, type RoundSummary } from './lib/session.ts'
import {
  loadDeck,
  loadLastExam,
  loadLastRound,
  loadStudentName,
  saveDeck,
  saveLastExam,
  saveLastRound,
  saveStudentName,
} from './lib/storage.ts'
import type { Card, TranslateResult } from './lib/types.ts'
import {
  addEntriesToDeck,
  addWordsToDeck,
  normalizeWord,
  type DeckUpdate,
  type WordEntry,
} from './lib/words.ts'

type Screen = 'deck' | 'study' | 'recap' | 'exam' | 'exam-result' | 'certificate'

export default function App() {
  const [screen, setScreen] = useState<Screen>('deck')
  const [cards, setCards] = useState<Card[]>(() => refreshLoadedDeck(loadDeck()))
  const [paste, setPaste] = useState('')
  const [translating, setTranslating] = useState(false)
  const [loadingDaf, setLoadingDaf] = useState(false)
  const [selectedPageId, setSelectedPageId] = useState(PAGES[0]?.id ?? 'bava-metzia-21b')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [reviewed, setReviewed] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionStreak, setSessionStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [solidGained, setSolidGained] = useState(0)
  const [lastRound, setLastRound] = useState<RoundSummary | null>(() => loadLastRound())
  const [studentName, setStudentName] = useState(() => loadStudentName())
  const [lastExam, setLastExam] = useState<ExamResult | null>(() => loadLastExam())

  useEffect(() => {
    saveDeck(cards)
  }, [cards])

  const current = useMemo(
    () => cards.find((card) => card.id === currentId),
    [cards, currentId],
  )

  function rememberExam(result: ExamResult) {
    setLastExam(result)
    saveLastExam(result)
    setStudentName(result.name)
  }

  function rememberRound(summary: RoundSummary) {
    setLastRound(summary)
    saveLastRound(summary)
  }

  function handleExamName(name: string) {
    setStudentName(name)
    saveStudentName(name)
    if (lastExam) {
      const next = { ...lastExam, name: name.trim() || 'Talmid' }
      setLastExam(next)
      saveLastExam(next)
    }
  }

  function handleExamSubmit(answers: string[], minutes: number) {
    rememberExam(gradeExam(answers, studentName, minutes))
    setScreen('exam-result')
  }

  function snapshotRound(complete: boolean): RoundSummary {
    return {
      correct: sessionCorrect,
      reviewed,
      solidGained,
      bestStreak,
      complete,
    }
  }

  function beginRound() {
    const first = pickNextCard(cards, null)
    if (!first) {
      return
    }
    setCurrentId(first.id)
    setReviewed(0)
    setSessionCorrect(0)
    setSessionStreak(0)
    setBestStreak(0)
    setSolidGained(0)
    setScreen('study')
  }

  async function fillMissingTranslations(added: Card[]) {
    const needsLookup = added.filter((card) => !card.translation.trim())
    if (needsLookup.length === 0) {
      return
    }

    setTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: needsLookup.map((card) => card.hebrew),
          lookupRef: PAGES.find((page) => page.id === selectedPageId)?.lookupRef,
        }),
      })
      const data = (await response.json()) as {
        results?: TranslateResult[]
        error?: string
      }
      if (!response.ok) {
        throw new Error(data.error || 'Could not look up translations.')
      }
      const lookups = new Map(
        (data.results ?? []).map((item) => [normalizeWord(item.word), item]),
      )
      setCards((currentCards) =>
        currentCards.map((card) => {
          const hit = lookups.get(card.id)
          if (!hit || card.translation.trim()) {
            return card
          }
          return {
            ...card,
            translation: hit.translation,
            source: hit.source,
          }
        }),
      )
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : 'Could not look up translations. You can type them in.',
      )
    } finally {
      setTranslating(false)
    }
  }

  async function ingestUpdate(result: DeckUpdate, emptyMessage: string) {
    setError('')
    setCards(result.cards)

    const parts: string[] = []
    if (result.added.length > 0) {
      parts.push(`Added ${result.added.length} word${result.added.length === 1 ? '' : 's'}.`)
    }
    if (result.skipped > 0) {
      parts.push(
        `Skipped ${result.skipped} duplicate${result.skipped === 1 ? '' : 's'}.`,
      )
    }
    if (result.added.length === 0 && result.skipped === 0) {
      parts.push(emptyMessage)
    }
    setNotice(parts.join(' '))

    if (result.added.length > 0) {
      await fillMissingTranslations(result.added)
    }
  }

  async function handleLoadDaf() {
    setError('')
    setLoadingDaf(true)
    try {
      const pack = buildDafPack(selectedPageId)
      if (pack.length === 0) {
        setNotice('That daf is not ready yet.')
        return
      }
      setCards(refreshLoadedDeck(cards))
      const words = pack.filter((card) => card.kind === 'word').length
      const sentences = pack.filter((card) => card.kind === 'sentence').length
      const questions = pack.filter((card) => card.kind === 'question').length
      setNotice(
        `Loaded ${pack.length} cards from this daf: ${words} words, ${sentences} Gemara, ${questions} questions.`,
      )
    } finally {
      setLoadingDaf(false)
    }
  }

  async function handleAdd() {
    const result = addWordsToDeck(cards, paste)
    setPaste('')
    await ingestUpdate(result, 'Paste some Hebrew or Aramaic words first.')
  }

  async function handleUpload(file: File) {
    setError('')
    setNotice(`Reading ${file.name}…`)
    try {
      const entries: WordEntry[] = await parseSpreadsheetFile(file)
      await ingestUpdate(
        addEntriesToDeck(cards, entries),
        'No Hebrew or Aramaic words found in that file.',
      )
    } catch (uploadError) {
      setNotice('')
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Could not read that spreadsheet.',
      )
    }
  }

  function handleTranslationChange(id: string, translation: string) {
    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === id
          ? { ...card, translation, source: 'manual' as const }
          : card,
      ),
    )
  }

  function handleRemove(id: string) {
    setCards((currentCards) => currentCards.filter((card) => card.id !== id))
  }

  function handleClear() {
    if (!window.confirm('Remove every word from this deck?')) {
      return
    }
    setCards([])
    setNotice('Deck cleared.')
    setError('')
  }

  function handleLeaveStudy() {
    if (reviewed > 0) {
      rememberRound(snapshotRound(false))
    }
    setScreen('deck')
  }

  const handleGrade = useCallback(
    (correct: boolean) => {
      if (!current) {
        return
      }
      const graded = gradeCard(current, correct)
      const nextCards = cards.map((card) => (card.id === graded.id ? graded : card))
      const nextReviewed = reviewed + 1
      const nextStreak = correct ? sessionStreak + 1 : 0
      const nextCorrect = sessionCorrect + (correct ? 1 : 0)
      const lockedIn =
        current.consecutiveCorrect < MASTER_STREAK &&
        graded.consecutiveCorrect >= MASTER_STREAK
      const nextSolid = solidGained + (lockedIn ? 1 : 0)
      const nextBest = Math.max(bestStreak, nextStreak)
      const summary: RoundSummary = {
        correct: nextCorrect,
        reviewed: nextReviewed,
        solidGained: nextSolid,
        bestStreak: nextBest,
        complete: nextReviewed >= ROUND_SIZE,
      }

      setCards(nextCards)
      setReviewed(nextReviewed)
      setSessionStreak(nextStreak)
      setSessionCorrect(nextCorrect)
      setSolidGained(nextSolid)
      setBestStreak(nextBest)

      if (summary.complete) {
        rememberRound(summary)
        setCurrentId(null)
        setScreen('recap')
        return
      }

      const next = pickNextCard(nextCards, graded.id)
      if (!next) {
        rememberRound({ ...summary, complete: true })
        setCurrentId(null)
        setScreen('recap')
        return
      }
      setCurrentId(next.id)
    },
    [
      bestStreak,
      cards,
      current,
      reviewed,
      sessionCorrect,
      sessionStreak,
      solidGained,
    ],
  )

  if (screen === 'exam') {
    return (
      <ExamScreen
        name={studentName}
        onNameChange={handleExamName}
        onSubmit={handleExamSubmit}
        onBack={() => setScreen('deck')}
      />
    )
  }

  if (screen === 'exam-result' && lastExam) {
    return (
      <ExamResultScreen
        result={lastExam}
        onCertificate={() => setScreen('certificate')}
        onAgain={() => setScreen('exam')}
        onHome={() => setScreen('deck')}
      />
    )
  }

  if (screen === 'certificate' && lastExam) {
    return (
      <CertificateScreen
        result={lastExam}
        onNameChange={handleExamName}
        onBack={() => setScreen('exam-result')}
        onHome={() => setScreen('deck')}
      />
    )
  }

  if (screen === 'recap') {
    return (
      <RecapScreen
        summary={lastRound ?? emptyRound()}
        onAgain={beginRound}
        onHome={() => setScreen('deck')}
      />
    )
  }

  if (screen === 'study' && current) {
    const masteredCount = cards.filter(
      (card) => card.consecutiveCorrect >= MASTER_STREAK,
    ).length
    return (
      <StudyScreen
        key={current.id}
        card={current}
        reviewed={reviewed}
        roundSize={ROUND_SIZE}
        sessionStreak={sessionStreak}
        masteredCount={masteredCount}
        onGrade={handleGrade}
        onBack={handleLeaveStudy}
      />
    )
  }

  return (
    <DeckScreen
      cards={cards}
      paste={paste}
      translating={translating}
      loadingDaf={loadingDaf}
      selectedPageId={selectedPageId}
      notice={notice}
      error={error}
      lastRound={lastRound}
      lastExam={lastExam}
      onSelectPage={setSelectedPageId}
      onLoadDaf={() => void handleLoadDaf()}
      onPasteChange={setPaste}
      onAdd={() => void handleAdd()}
      onUpload={(file) => void handleUpload(file)}
      onTranslationChange={handleTranslationChange}
      onRemove={handleRemove}
      onClear={handleClear}
      onStart={beginRound}
      onExam={() => setScreen('exam')}
      onCertificate={() => setScreen('certificate')}
    />
  )
}
