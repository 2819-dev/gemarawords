import type { Card } from '../lib/types.ts'

const STYLES: Record<Card['kind'], string> = {
  word: 'bg-accent/10 text-accent',
  sentence: 'bg-mark/10 text-mark',
  question: 'bg-ok/10 text-ok',
}

const DOT: Record<Card['kind'], string> = {
  word: 'bg-accent',
  sentence: 'bg-mark',
  question: 'bg-ok',
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${STYLES[kind]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[kind]}`} aria-hidden="true" />
      {kindLabel(kind)}
    </span>
  )
}
