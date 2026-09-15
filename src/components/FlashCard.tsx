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
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-1 py-4">
      <KindBadge kind={card.kind} />
      <MixedText
        text={prompt}
        className="mt-5 max-w-lg text-center text-[1.35rem] font-medium leading-snug text-ink sm:text-[1.7rem]"
        hebrewClassName="text-[1.7rem] font-medium sm:text-[2rem]"
      />
      {showSource ? (
        <p
          className={`hebrew mt-8 max-w-lg border-r-2 border-gold pr-4 text-right text-ink ${
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
