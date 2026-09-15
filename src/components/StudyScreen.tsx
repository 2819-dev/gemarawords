import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { FlashCard } from './FlashCard.tsx'
import { MixedText } from './MixedText.tsx'
import { checkAnswer, type AnswerCheck } from '../lib/answer.ts'
import type { Card } from '../lib/types.ts'

type StudyScreenProps = {
  card: Card
  reviewed: number
  deckSize: number
  onGrade: (correct: boolean) => void
  onBack: () => void
}

export function StudyScreen({
  card,
  reviewed,
  deckSize,
  onGrade,
  onBack,
}: StudyScreenProps) {
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState<AnswerCheck | null>(null)

  function submitAnswer(raw: string) {
    setResult(checkAnswer(card, raw))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim() || result) {
      return
    }
    submitAnswer(draft)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (draft.trim() && !result) {
        submitAnswer(draft)
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-ink-soft hover:text-ink"
        >
          ← Deck
        </button>
        <p className="text-sm text-ink-soft">
          {deckSize} cards · reviewed {reviewed}
        </p>
      </div>

      <FlashCard card={card} />

      {result ? (
        <section className="flex flex-col gap-4" aria-live="polite">
          <p
            className={`rounded-2xl px-4 py-3 text-center text-lg font-semibold ${
              result.correct ? 'bg-olive/15 text-olive' : 'bg-brick/10 text-brick'
            }`}
          >
            {feedbackCopy(result)}
          </p>
          <div className="rounded-3xl border border-gold/40 bg-card px-6 py-5 shadow-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Answer
            </p>
            <p className="text-lg font-medium leading-snug text-ink">
              <MixedText text={card.translation} hebrewClassName="text-xl font-medium" />
            </p>
            {draft.trim() ? (
              <p className="mt-4 text-sm text-ink-soft">
                Your answer: <MixedText text={draft.trim()} />
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onGrade(!result.correct)}
              className="rounded-2xl border border-parchment-dark bg-card px-4 py-3 text-base font-semibold text-ink"
            >
              {result.correct ? 'I was wrong' : 'I was right'}
            </button>
            <button
              type="button"
              onClick={() => onGrade(result.correct)}
              className="rounded-2xl bg-ink px-4 py-3 text-base font-semibold text-parchment"
            >
              Continue
            </button>
          </div>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="answer" className="text-sm font-semibold">
            Your answer
          </label>
          <textarea
            id="answer"
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            dir="ltr"
            placeholder="Type the pshat"
            className="w-full resize-y rounded-2xl border border-parchment-dark bg-card px-4 py-3 text-lg text-ink outline-none ring-gold/40 focus:ring-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => submitAnswer('')}
              className="rounded-2xl border border-parchment-dark bg-card px-4 py-3 text-base font-semibold text-ink"
            >
              I don’t know
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="rounded-2xl bg-burgundy px-4 py-3 text-base font-semibold text-parchment disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check
            </button>
          </div>
        </form>
      )}
    </main>
  )
}

function feedbackCopy(result: AnswerCheck): string {
  if (result.correct) {
    return 'That looks right.'
  }
  if (result.reason === 'empty') {
    return 'Here is the answer.'
  }
  if (result.reason === 'echo') {
    return 'Say what it means, not just the same words.'
  }
  return 'Not quite.'
}
