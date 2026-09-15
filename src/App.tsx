import { useEffect, useMemo, useState } from 'react'
import { DeckScreen } from './components/DeckScreen.tsx'
import { StudyScreen } from './components/StudyScreen.tsx'
import { gradeCard, pickNextCard } from './lib/scheduler.ts'
import { loadDeck, saveDeck } from './lib/storage.ts'
import type { Card, TranslateResult } from './lib/types.ts'
import { addWordsToDeck, normalizeWord } from './lib/words.ts'

type Screen = 'deck' | 'study'

export default function App() {
  const [screen, setScreen] = useState<Screen>('deck')
  const [cards, setCards] = useState<Card[]>(() => loadDeck())
  const [paste, setPaste] = useState('')
  const [translating, setTranslating] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  useEffect(() => {
    saveDeck(cards)
  }, [cards])

  const current = useMemo(
    () => cards.find((card) => card.id === currentId),
    [cards, currentId],
  )

  async function handleAdd() {
    setError('')
    const result = addWordsToDeck(cards, paste)
    setCards(result.cards)
    setPaste('')

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
      parts.push('Paste some Hebrew words first.')
    }
    setNotice(parts.join(' '))

    if (result.added.length === 0) {
      return
    }

    setTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: result.added.map((card) => card.hebrew) }),
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
    setFlipped(false)
    setReviewed(0)
    setScreen('study')
  }

  function handleGrade(correct: boolean) {
    if (!current) {
      return
    }
    const graded = gradeCard(current, correct)
    const nextCards = cards.map((card) => (card.id === graded.id ? graded : card))
    setCards(nextCards)
    setReviewed((count) => count + 1)
    const next = pickNextCard(nextCards, graded.id)
    setCurrentId(next?.id ?? null)
    setFlipped(false)
  }

  if (screen === 'study' && current) {
    return (
      <StudyScreen
        card={current}
        flipped={flipped}
        reviewed={reviewed}
        deckSize={cards.length}
        onFlip={() => setFlipped(true)}
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
      notice={notice}
      error={error}
      onPasteChange={setPaste}
      onAdd={() => void handleAdd()}
      onTranslationChange={handleTranslationChange}
      onRemove={handleRemove}
      onClear={handleClear}
      onStart={handleStart}
    />
  )
}
