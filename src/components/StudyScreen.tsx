import { useEffect, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { FlashCard } from './FlashCard.tsx'
import { MixedText } from './MixedText.tsx'
import { AppFrame } from './AppFrame.tsx'
import { checkAnswer, type AnswerCheck } from '../lib/answer.ts'
import { MASTER_STREAK } from '../lib/scheduler.ts'
import type { Card } from '../lib/types.ts'

type StudyScreenProps = {
  card: Card
  reviewed: number
  roundSize: number
  sessionStreak: number
  masteredCount: number
  onGrade: (correct: boolean) => void
  onBack: () => void
}

export function StudyScreen({
  card,
  reviewed,
  roundSize,
  sessionStreak,
  masteredCount,
  onGrade,
  onBack,
}: StudyScreenProps) {
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState<AnswerCheck | null>(null)
  const answered = Boolean(result)
  const roundDone = Math.min(roundSize, reviewed + (answered ? 1 : 0))
  const solidNow = Boolean(result?.correct && card.consecutiveCorrect + 1 >= MASTER_STREAK)
  const liveStreak = result ? (result.correct ? sessionStreak + 1 : 0) : sessionStreak

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

  function handleKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (draft.trim() && !result) {
        submitAnswer(draft)
      }
    }
  }

  useEffect(() => {
    if (!result) {
      return
    }
    const verdict = result.correct
    function onKey(event: KeyboardEvent) {
      if (event.isComposing || event.key !== 'Enter' || event.shiftKey) {
        return
      }
      event.preventDefault()
      onGrade(verdict)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [result, onGrade])

  return (
    <AppFrame>
      <main className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full px-2 py-1 text-sm font-semibold text-muted hover:text-ink"
          >
            ← Deck
          </button>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {liveStreak > 0 ? (
              <p className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                {liveStreak} in a row
              </p>
            ) : (
              <p className="text-sm text-muted">{masteredCount} solid</p>
            )}
          </div>
        </header>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            <span>This round</span>
            <span>
              {roundDone}/{roundSize}
            </span>
          </div>
          <div
            className="flex gap-1"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={roundSize}
            aria-valuenow={roundDone}
            aria-label={`${roundDone} of ${roundSize} cards this round`}
          >
            {Array.from({ length: roundSize }, (_, index) => (
              <span
                key={index}
                className={`h-2.5 flex-1 rounded-full ${
                  index < roundDone ? 'bg-accent' : 'bg-line'
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className={`study-enter quiz-card mt-5 flex min-h-0 flex-1 flex-col ${
            result ? (result.correct ? (solidNow ? 'quiz-burst quiz-pop' : 'quiz-pop') : 'quiz-shake') : ''
          }`}
        >
          <FlashCard card={card} />
        </div>

        {result ? (
          <section
            className={`mt-4 mb-2 rounded-[1.5rem] border px-5 py-5 ${
              result.correct
                ? 'border-ok/25 bg-ok/10'
                : 'border-bad/20 bg-bad/10'
            }`}
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <ResultMark ok={result.correct} />
              <div className="min-w-0 flex-1">
                <p
                  className={`font-display text-2xl font-medium ${
                    result.correct ? 'text-ok' : 'text-bad'
                  }`}
                >
                  {feedbackCopy(result, solidNow, liveStreak)}
                </p>
                {solidNow ? (
                  <p className="mt-1 text-sm font-semibold text-ok">
                    Twice in a row — this one is solid.
                  </p>
                ) : null}
                {result.correct && liveStreak >= 3 && !solidNow ? (
                  <p className="mt-1 text-sm font-semibold text-ok">
                    Keep the pshat coming.
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              The pshat
            </p>
            <p className="mt-1 text-lg font-medium leading-snug text-ink">
              <MixedText text={card.translation} hebrewClassName="text-xl font-medium" />
            </p>
            {draft.trim() ? (
              <p className="mt-3 text-sm text-muted">
                You said: <MixedText text={draft.trim()} />
              </p>
            ) : null}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onGrade(!result.correct)}
                className="pressable rounded-full border border-ink/15 bg-card px-4 py-3 text-base font-semibold text-ink"
              >
                {result.correct ? 'I was wrong' : 'I was right'}
              </button>
              <button
                type="button"
                onClick={() => onGrade(result.correct)}
                className="pressable rounded-full bg-ink px-4 py-3 text-base font-semibold text-white shadow-md"
              >
                {roundDone >= roundSize ? 'See the round' : 'Continue'}
              </button>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 z-10 -mx-4 mt-4 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6"
          >
            <label htmlFor="answer" className="sr-only">
              Your answer in English
            </label>
            <textarea
              id="answer"
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              dir="ltr"
              autoComplete="off"
              autoCorrect="off"
              spellCheck
              placeholder={placeholderFor(card)}
              className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 text-lg text-ink shadow-[0_8px_24px_-18px_rgba(20,22,28,0.35)] outline-none ring-accent/40 focus:ring-2"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => submitAnswer('')}
                className="pressable rounded-full border border-ink/15 bg-card px-4 py-3 text-base font-semibold text-ink"
              >
                I don’t know
              </button>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="pressable rounded-full bg-accent px-4 py-3 text-base font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Check
              </button>
            </div>
          </form>
        )}
      </main>
    </AppFrame>
  )
}

function ResultMark({ ok }: { ok: boolean }) {
  return (
    <span
      className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${
        ok ? 'bg-ok' : 'bg-bad'
      }`}
      aria-hidden="true"
    >
      {ok ? '✓' : '!'}
    </span>
  )
}

function feedbackCopy(
  result: AnswerCheck,
  solidNow: boolean,
  liveStreak: number,
): string {
  if (result.correct) {
    if (solidNow) {
      return 'Locked in.'
    }
    if (liveStreak >= 4) {
      return 'You’re flying.'
    }
    if (liveStreak >= 2) {
      return 'That’s the pshat.'
    }
    return 'Yes.'
  }
  if (result.reason === 'empty') {
    return 'Here’s the pshat.'
  }
  if (result.reason === 'echo') {
    return 'Say it in English — copying the Hebrew is not the pshat.'
  }
  return 'Not yet.'
}

function placeholderFor(card: Card): string {
  if (card.kind === 'question') {
    return 'The raayah or diyuk, in English'
  }
  if (card.kind === 'sentence') {
    return 'The pshat of this line, in English'
  }
  return 'Type the pshat in English'
}
