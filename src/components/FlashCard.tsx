import type { Card } from '../lib/types.ts'
import { questionFor } from '../lib/answer.ts'

type FlashCardProps = {
  card: Card
}

export function FlashCard({ card }: FlashCardProps) {
  const prompt = questionFor(card)
  const longHebrew = card.kind === 'sentence' || card.hebrew.length > 16
  const hebrewSize = longHebrew ? 'text-2xl leading-relaxed' : 'text-5xl leading-snug'

  return (
    <section className="flex min-h-72 w-full flex-col items-center justify-center overflow-y-auto rounded-3xl border border-gold/40 bg-card px-6 py-5 shadow-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
        {kindLabel(card.kind)}
      </p>
      <p className="text-center text-xl font-semibold leading-snug text-ink" dir="ltr">
        {prompt}
      </p>
      <p
        className={`hebrew mt-5 text-center text-ink ${hebrewSize}`}
        lang="he"
        dir="rtl"
      >
        {card.hebrew}
      </p>
    </section>
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
