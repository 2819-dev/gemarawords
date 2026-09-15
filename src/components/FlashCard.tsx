import type { Card } from '../lib/types.ts'

type FlashCardProps = {
  card: Card
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ card, flipped, onFlip }: FlashCardProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!flipped) {
          onFlip()
        }
      }}
      aria-pressed={flipped}
      className="card-flip h-72 w-full text-left"
    >
      <div className={`card-flip-inner h-full w-full ${flipped ? 'is-flipped' : ''}`}>
        <div className="card-face absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-gold/40 bg-card px-6 shadow-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Hebrew
          </p>
          <p className="hebrew text-center text-5xl leading-snug text-ink" lang="he" dir="rtl">
            {card.hebrew}
          </p>
          <p className="mt-6 text-sm text-ink-soft">Tap to see the translation</p>
        </div>
        <div className="card-face card-back absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-gold/40 bg-card px-6 shadow-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Translation
          </p>
          <p className="text-center text-3xl font-medium leading-snug text-ink" dir="ltr">
            {card.translation}
          </p>
          <p className="mt-6 text-sm text-ink-soft">Did you know it?</p>
        </div>
      </div>
    </button>
  )
}
