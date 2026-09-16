import { AppFrame } from './AppFrame.tsx'
import { ROUND_SIZE, roundHeadline, type RoundSummary } from '../lib/session.ts'

type RecapScreenProps = {
  summary: RoundSummary
  onAgain: () => void
  onHome: () => void
  onExam: () => void
}

export function RecapScreen({ summary, onAgain, onHome, onExam }: RecapScreenProps) {
  const perfect = summary.correct === summary.reviewed && summary.reviewed > 0

  return (
    <AppFrame>
      <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
        <section className="quiz-card study-enter relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12">
          <p
            className="hebrew pointer-events-none absolute -bottom-8 -right-4 select-none text-[7rem] leading-none text-accent opacity-[0.07]"
            lang="he"
            dir="rtl"
            aria-hidden="true"
          >
            גמרא
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {summary.complete ? 'Round' : 'Paused'}
          </p>
          <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            {roundHeadline(summary)}
          </h1>
          <p
            className={`font-display mt-6 text-6xl font-medium ${
              perfect ? 'text-ok' : 'text-ink'
            }`}
          >
            {summary.correct}
            <span className="text-3xl text-muted">/{summary.reviewed}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {summary.complete
              ? `${ROUND_SIZE} cards of English pshat`
              : 'Come back and finish the round'}
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-2 text-center">
            <RecapStat label="Locked in" value={summary.solidGained} />
            <RecapStat label="Best streak" value={summary.bestStreak} />
            <RecapStat
              label="Misses"
              value={Math.max(0, summary.reviewed - summary.correct)}
            />
          </dl>

          <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAgain}
              className="pressable flex-1 rounded-full bg-accent px-5 py-3.5 text-lg font-semibold text-white shadow-md"
            >
              One more round
            </button>
            <button
              type="button"
              onClick={onHome}
              className="pressable rounded-full border border-ink/15 bg-canvas px-5 py-3.5 text-base font-semibold text-ink sm:min-w-44"
            >
              Back to the sugya
            </button>
          </div>
          {summary.complete ? (
            <button
              type="button"
              onClick={onExam}
              className="relative mt-4 text-sm font-semibold text-muted hover:text-ink"
            >
              Or sit the bechina
            </button>
          ) : null}
        </section>
      </main>
    </AppFrame>
  )
}

function RecapStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-canvas px-3 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="font-display mt-1 text-2xl font-medium text-ink">{value}</dd>
    </div>
  )
}
