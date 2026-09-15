import { MixedText } from './MixedText.tsx'
import { AppFrame } from './AppFrame.tsx'
import type { ExamResult } from '../lib/exam.ts'

type ExamResultScreenProps = {
  result: ExamResult
  onCertificate: () => void
  onAgain: () => void
  onHome: () => void
}

export function ExamResultScreen({
  result,
  onCertificate,
  onAgain,
  onHome,
}: ExamResultScreenProps) {
  const misses = result.items.filter((item) => !item.correct)
  const perfect = result.correct === result.total

  return (
    <AppFrame>
      <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-6 px-4 py-8 pb-16 sm:px-6">
        <section className="quiz-card study-enter relative overflow-hidden px-6 py-10 text-center sm:px-10">
          <p
            className="hebrew pointer-events-none absolute -bottom-8 -right-4 select-none text-[7rem] leading-none text-accent opacity-[0.07]"
            lang="he"
            dir="rtl"
            aria-hidden="true"
          >
            מבחן
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            Test Week
          </p>
          <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            {result.honor}
          </h1>
          <p
            className={`font-display mt-6 text-6xl font-medium ${
              result.passed ? 'text-ok' : 'text-ink'
            }`}
          >
            {result.correct}
            <span className="text-3xl text-muted">/{result.total}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {result.percent}%
            {result.minutes > 0 ? ` · ${result.minutes} min` : ''}
            {result.passed ? ' · certificate ready' : ' · sit it again when the pshat is tighter'}
          </p>
          {perfect ? (
            <p className="mt-4 text-sm font-semibold text-ok">Every raayah. Every diyuk.</p>
          ) : null}

          <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCertificate}
              className="pressable flex-1 rounded-full bg-accent px-5 py-3.5 text-lg font-semibold text-white shadow-md"
            >
              {result.passed ? 'Get the certificate' : 'See the certificate'}
            </button>
            <button
              type="button"
              onClick={onAgain}
              className="pressable rounded-full border border-ink/15 bg-canvas px-5 py-3.5 text-base font-semibold text-ink sm:min-w-40"
            >
              Sit it again
            </button>
          </div>
          <button
            type="button"
            onClick={onHome}
            className="mt-3 text-sm font-semibold text-muted hover:text-ink"
          >
            Back to the sugya
          </button>
        </section>

        {misses.length > 0 ? (
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-medium text-ink">Look these over</h2>
            <p className="text-sm text-muted">
              The written answers on a paper test are not always the pshat. Here is
              what the sugya is saying.
            </p>
            <ul className="flex flex-col gap-3">
              {misses.map((item) => {
                const number = result.items.indexOf(item) + 1
                return (
                  <li key={item.question.id} className="quiz-card px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      Question {number}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">
                      <MixedText text={item.question.prompt} hebrewClassName="text-base font-medium" />
                    </p>
                    {item.answer.trim() ? (
                      <p className="mt-3 text-sm text-muted">
                        You wrote: {item.answer}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-muted">Left blank.</p>
                    )}
                    <p className="mt-2 text-sm font-medium text-ok">
                      {item.question.translation}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
      </main>
    </AppFrame>
  )
}
