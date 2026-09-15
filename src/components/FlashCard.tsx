import type { Card } from '../lib/types.ts'

type FlashCardProps = {
  card: Card
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ card, flipped, onFlip }: FlashCardProps) {
  const front = card.prompt ?? card.hebrew
  const hebrewFront = !card.prompt
  const frontSize =
    card.kind === 'sentence'
      ? 'text-2xl leading-relaxed'
      : card.kind === 'question'
        ? 'text-2xl leading-snug'
        : 'text-5xl leading-snug'

  return (
    <button
      type="button"
      onClick={() => {
        if (!flipped) {
          onFlip()
        }
      }}
      aria-pressed={flipped}
      className="card-flip h-80 w-full text-left"
    >
      <div className={`card-flip-inner h-full w-full ${flipped ? 'is-flipped' : ''}`}>
        <div className="card-face absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-3xl border border-gold/40 bg-card px-6 py-5 shadow-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            {kindLabel(card.kind)}
          </p>
          <p
            className={`${hebrewFront ? 'hebrew' : ''} text-center text-ink ${frontSize}`}
            lang={hebrewFront ? 'he' : 'en'}
            dir={hebrewFront ? 'rtl' : 'ltr'}
          >
            {front}
          </p>
          <p className="mt-6 text-sm text-ink-soft">Tap to see the answer</p>
        </div>
        <div className="card-face card-back absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-3xl border border-gold/40 bg-card px-6 py-5 shadow-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Answer
          </p>
          <p className="text-center text-xl font-medium leading-snug text-ink" dir="ltr">
            {card.translation}
          </p>
          {card.prompt ? (
            <p className="hebrew mt-4 text-center text-lg text-ink-soft" lang="he" dir="rtl">
              {card.hebrew}
            </p>
          ) : null}
          <p className="mt-6 text-sm text-ink-soft">Did you know it?</p>
        </div>
      </div>
    </button>
  )
}

function kindLabel(kind: Card['kind']): string {
  if (kind === 'sentence') {
    return 'Sentence'
  }
  if (kind === 'question') {
    return 'Question'
  }
  return 'Word'
}
