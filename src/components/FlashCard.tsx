import type { Card } from '../lib/types.ts'
import { questionFor } from '../lib/answer.ts'
import { promptIncludesLemma } from '../lib/mixedText.ts'
import { KindBadge } from './KindBadge.tsx'
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
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-6 sm:px-8">
      <KindBadge kind={card.kind} />
      <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {hintFor(card.kind)}
      </p>
      <MixedText
        text={prompt}
        className="mt-4 max-w-lg text-center text-[1.35rem] font-medium leading-snug text-ink sm:text-[1.7rem]"
        hebrewClassName="text-[1.7rem] font-medium sm:text-[2rem]"
      />
      {showSource ? (
        <p
          className={`hebrew mt-8 w-full max-w-lg rounded-2xl bg-canvas px-4 py-4 text-right text-ink shadow-[inset_0_0_0_1px_var(--color-line)] ${
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

function hintFor(kind: Card['kind']): string {
  if (kind === 'sentence') {
    return 'Say the pshat — in English'
  }
  if (kind === 'question') {
    return 'The sugya, not the wording'
  }
  return 'What does this mean?'
}
