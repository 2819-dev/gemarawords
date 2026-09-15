import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeckScreen } from './components/DeckScreen.tsx'
import { StudyScreen } from './components/StudyScreen.tsx'
import { buildDafPack, PAGES, refreshLoadedDeck } from './lib/daf.ts'
import { gradeCard, MASTER_STREAK, pickNextCard } from './lib/scheduler.ts'
import { parseSpreadsheetFile } from './lib/spreadsheet.ts'
import { loadDeck, saveDeck } from './lib/storage.ts'
import type { Card, TranslateResult } from './lib/types.ts'
import {
  addEntriesToDeck,
  addWordsToDeck,
  normalizeWord,
  type DeckUpdate,
  type WordEntry,
} from './lib/words.ts'

type Screen = 'deck' | 'study'

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

  useEffect(() => {
    saveDeck(cards)
  }, [cards])

  const current = useMemo(
    () => cards.find((card) => card.id === currentId),
    [cards, currentId],
  )

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

  function handleStart() {
    const first = pickNextCard(cards, null)
    if (!first) {
      return
    }
    setCurrentId(first.id)
    setReviewed(0)
    setSessionCorrect(0)
    setScreen('study')
  }

  const handleGrade = useCallback(
    (correct: boolean) => {
      if (!current) {
        return
      }
      const graded = gradeCard(current, correct)
      const nextCards = cards.map((card) => (card.id === graded.id ? graded : card))
      setCards(nextCards)
      setReviewed((count) => count + 1)
      if (correct) {
        setSessionCorrect((count) => count + 1)
      }
      const next = pickNextCard(nextCards, graded.id)
      setCurrentId(next?.id ?? null)
    },
    [cards, current],
  )

  if (screen === 'study' && current) {
    const masteredCount = cards.filter(
      (card) => card.consecutiveCorrect >= MASTER_STREAK,
    ).length
    return (
      <StudyScreen
        key={current.id}
        card={current}
        reviewed={reviewed}
        sessionCorrect={sessionCorrect}
        deckSize={cards.length}
        masteredCount={masteredCount}
        onGrade={handleGrade}
        onBack={() => setScreen('deck')}
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
      onSelectPage={setSelectedPageId}
      onLoadDaf={() => void handleLoadDaf()}
      onPasteChange={setPaste}
      onAdd={() => void handleAdd()}
      onUpload={(file) => void handleUpload(file)}
      onTranslationChange={handleTranslationChange}
      onRemove={handleRemove}
      onClear={handleClear}
      onStart={handleStart}
    />
  )
}
