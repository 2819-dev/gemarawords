import type { Card } from '../lib/types.ts'

const STYLES: Record<Card['kind'], string> = {
  word: 'bg-burgundy/10 text-burgundy',
  sentence: 'bg-gold/20 text-ink',
  question: 'bg-olive/10 text-olive',
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

export function KindBadge({ kind }: { kind: Card['kind'] }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${STYLES[kind]}`}
    >
      {kindLabel(kind)}
    </span>
  )
}
