import type { Card } from '../lib/types.ts'
import { questionFor } from '../lib/answer.ts'
import { promptIncludesLemma } from '../lib/mixedText.ts'
import { MixedText } from './MixedText.tsx'

type FlashCardProps = {
  card: Card
}

export function FlashCard({ card }: FlashCardProps) {
  const prompt = questionFor(card)
  const showSource =
    card.kind === 'sentence' || !promptIncludesLemma(prompt, card.hebrew)
  const longHebrew = card.kind === 'sentence' || card.hebrew.length > 16

  return (
    <section className="flex min-h-72 w-full flex-col items-center justify-center overflow-y-auto rounded-3xl border border-gold/40 bg-card px-6 py-5 shadow-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
        {kindLabel(card.kind)}
      </p>
      <MixedText
        text={prompt}
        className="text-center text-xl font-semibold leading-snug text-ink"
        hebrewClassName="text-[1.65rem] font-medium"
      />
      {showSource ? (
        <p
          className={`hebrew mt-6 text-center text-ink ${
            longHebrew ? 'text-2xl leading-relaxed' : 'text-5xl leading-snug'
          }`}
          lang="he"
          dir="rtl"
        >
          {card.hebrew}
        </p>
      ) : null}
    </section>
  )
}

function kindLabel(kind: Card['kind']): string {
  if (kind === 'sentence') {
    return 'Gemara'
  }
  if (kind === 'question') {
    return 'Question'
  }
  return 'Word'
}
