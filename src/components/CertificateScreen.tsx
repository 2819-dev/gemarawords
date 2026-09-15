import { AppFrame } from './AppFrame.tsx'
import {
  EXAM_CHAPTER,
  EXAM_HEBREW,
  EXAM_TITLE,
  certificateHtml,
  downloadBlob,
  type ExamResult,
} from '../lib/exam.ts'

type CertificateScreenProps = {
  result: ExamResult
  onNameChange: (name: string) => void
  onBack: () => void
  onHome: () => void
}

export function CertificateScreen({
  result,
  onNameChange,
  onBack,
  onHome,
}: CertificateScreenProps) {
  const when = formatDate(result.takenAt)

  function download() {
    downloadBlob(
      `bechina-certificate-${slug(result.name)}.html`,
      certificateHtml(result),
      'text/html;charset=utf-8',
    )
  }

  return (
    <AppFrame>
      <main className="mx-auto flex min-h-full max-w-3xl flex-col gap-6 px-4 py-8 pb-16 sm:px-6">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-muted hover:text-ink"
          >
            Back to the score
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="pressable rounded-full border border-ink/15 bg-card px-4 py-2 text-sm font-semibold text-ink"
            >
              Print
            </button>
            <button
              type="button"
              onClick={download}
              className="pressable rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md"
            >
              Download
            </button>
          </div>
        </div>

        <label className="print:hidden flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Name on the certificate
          </span>
          <input
            value={result.name}
            onChange={(event) => onNameChange(event.target.value)}
            className="rounded-2xl border border-line bg-card px-4 py-3 text-lg text-ink outline-none ring-accent/40 focus:ring-2"
          />
        </label>

        <section className="certificate-sheet study-enter px-6 py-10 text-center sm:px-14 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            Gemara Words · Test Week
          </p>
          <h1 className="font-display mt-4 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Bechina Certificate
          </h1>
          <p className="hebrew mt-3 text-3xl text-ink" lang="he" dir="rtl">
            {EXAM_HEBREW}
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.18em] text-muted">
            This certifies that
          </p>
          <p className="font-display mt-3 border-b border-ink/20 pb-2 text-3xl font-medium text-ink sm:text-4xl">
            {result.name.trim() || 'Talmid'}
          </p>
          <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-muted">
            sat the bechina on {EXAM_TITLE} · {EXAM_CHAPTER} and can say the pshat
            of the sugya in English — the machlokes, the diyukim, and the raayos.
          </p>
          <p className="font-display mt-8 text-3xl font-medium text-accent">{result.honor}</p>
          <p className="font-display mt-4 text-6xl font-medium text-ink">
            {result.correct}
            <span className="text-3xl text-muted">/{result.total}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {result.percent}%
            {result.minutes > 0 ? ` · ${result.minutes} min` : ''} · {when}
          </p>
          <div
            className={`certificate-seal mx-auto mt-8 ${
              result.passed ? 'text-ok' : 'text-accent'
            }`}
          >
            {result.passed ? 'PASSED' : 'SIT AGAIN'}
          </div>
        </section>

        <button
          type="button"
          onClick={onHome}
          className="print:hidden text-sm font-semibold text-muted hover:text-ink"
        >
          Back to the sugya
        </button>
      </main>
    </AppFrame>
  )
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function slug(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return cleaned || 'talmid'
}
