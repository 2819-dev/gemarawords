import { FlashCard } from './FlashCard.tsx'
import type { Card } from '../lib/types.ts'

type StudyScreenProps = {
  card: Card
  flipped: boolean
  reviewed: number
  deckSize: number
  onFlip: () => void
  onGrade: (correct: boolean) => void
  onBack: () => void
}

export function StudyScreen({
  card,
  flipped,
  reviewed,
  deckSize,
  onFlip,
  onGrade,
  onBack,
}: StudyScreenProps) {
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

      <FlashCard card={card} flipped={flipped} onFlip={onFlip} />

      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onGrade(false)}
            className="rounded-2xl bg-brick px-4 py-3 text-lg font-semibold text-white"
          >
            Incorrect
          </button>
          <button
            type="button"
            onClick={() => onGrade(true)}
            className="rounded-2xl bg-olive px-4 py-3 text-lg font-semibold text-white"
          >
            Correct
          </button>
        </div>
      ) : (
        <p className="text-center text-ink-soft">
          Think of the answer, then tap the card.
        </p>
      )}
    </main>
  )
}
