import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { MixedText } from './MixedText.tsx'
import { AppFrame } from './AppFrame.tsx'
import {
  EXAM_CHAPTER,
  EXAM_HEBREW,
  EXAM_SECTIONS,
  answeredCount,
  downloadBlob,
  examAnswerSheet,
  examPacketHtml,
  examQuestions,
  parseAnswerSheet,
} from '../lib/exam.ts'

type ExamScreenProps = {
  name: string
  onNameChange: (name: string) => void
  onSubmit: (answers: string[], minutes: number) => void
  onBack: () => void
}

const QUESTIONS = examQuestions()

export function ExamScreen({ name, onNameChange, onSubmit, onBack }: ExamScreenProps) {
  const [answers, setAnswers] = useState<string[]>(() => QUESTIONS.map(() => ''))
  const [photos, setPhotos] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const fileInput = useRef<HTMLInputElement>(null)
  const filled = answeredCount(answers)
  const minutes = Math.max(0, Math.round((now - startedAt) / 60000))

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000)
    return () => window.clearInterval(timer)
  }, [])

  const sections = useMemo(
    () =>
      EXAM_SECTIONS.map((section) => ({
        ...section,
        items: QUESTIONS.map((question, index) => ({ question, index })).filter(
          ({ question }) => question.sectionId === section.id,
        ),
      })),
    [],
  )

  async function takeFiles(fileList: FileList | File[]) {
    const files = [...fileList]
    if (files.length === 0) {
      return
    }
    setError('')
    const nextPhotos: string[] = []
    const texts: string[] = []
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        nextPhotos.push(await readDataUrl(file))
        continue
      }
      texts.push(await file.text())
    }
    if (nextPhotos.length > 0) {
      setPhotos((current) => [...current, ...nextPhotos])
      setNotice(
        'Got your pages. Type what you wrote — the bechina will score the English.',
      )
    }
    if (texts.length > 0) {
      const parsed = parseAnswerSheet(texts.join('\n\n'))
      setAnswers(parsed)
      const filledFromFile = answeredCount(parsed)
      setNotice(
        filledFromFile > 0
          ? `Read ${filledFromFile} answer${filledFromFile === 1 ? '' : 's'} from the upload.`
          : 'Could not find numbered answers. Type them in below.',
      )
    }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    void takeFiles(event.target.files ?? [])
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    void takeFiles(event.dataTransfer.files)
  }

  function downloadPacket() {
    downloadBlob(
      'bava-metzia-21b-test-week.html',
      examPacketHtml(),
      'text/html;charset=utf-8',
    )
  }

  function downloadSheet() {
    downloadBlob(
      'bava-metzia-21b-answers.txt',
      examAnswerSheet(),
      'text/plain;charset=utf-8',
    )
  }

  function handleSubmit() {
    if (filled === 0) {
      setError('Write at least one English answer before handing it in.')
      return
    }
    onSubmit(answers, Math.max(1, Math.round((Date.now() - startedAt) / 60000)))
  }

  return (
    <AppFrame>
      <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-6 px-4 py-6 pb-32 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-muted hover:text-ink"
          >
            Back to the sugya
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            Test Week
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            The bechina
          </h1>
          <p
            className="hebrew text-right text-2xl text-ink"
            lang="he"
            dir="rtl"
          >
            {EXAM_HEBREW}
            <span className="text-muted"> · {EXAM_CHAPTER}</span>
          </p>
          <p className="max-w-lg text-[1.05rem] leading-relaxed text-muted">
            Same sugya as a written test: the machlokes, the diyuk, the raayos.
            Write the pshat in English. Download a packet, upload what you wrote,
            or sit it right here.
          </p>
        </header>

        <section className="quiz-card flex flex-col gap-4 p-5 sm:p-6">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Your name
            </span>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="For the certificate"
              className="rounded-2xl border border-line bg-canvas px-4 py-3 text-lg text-ink outline-none ring-accent/40 focus:ring-2"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadPacket}
              className="pressable rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md"
            >
              Download the test
            </button>
            <button
              type="button"
              onClick={downloadSheet}
              className="pressable rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Answer sheet
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="pressable rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Upload answers
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,.txt,.md,.html,text/plain,text/markdown,text/html"
            className="sr-only"
            onChange={handleFiles}
          />
          <p
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="rounded-2xl border border-dashed border-line bg-canvas px-4 py-3 text-sm text-muted"
          >
            Drop a filled answer sheet or photos of your written test. Numbered
            text is scored automatically. Photos stay here so you can type what
            you wrote.
          </p>
          {notice ? (
            <p className="rounded-xl bg-ok/10 px-3 py-2 text-sm text-ok">{notice}</p>
          ) : null}
          {error ? (
            <p className="rounded-xl bg-bad/10 px-3 py-2 text-sm text-bad">{error}</p>
          ) : null}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map((src, index) => (
                <img
                  key={`${src.slice(0, 24)}-${index}`}
                  src={src}
                  alt={`Uploaded page ${index + 1}`}
                  className="h-28 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          ) : null}
        </section>

        {sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-3">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">{section.title}</h2>
              <p className="text-sm text-muted">{section.hint}</p>
            </div>
            {section.items.map(({ question, index }) => (
              <article key={question.id} className="quiz-card overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                  <p className="font-display mt-0.5 w-8 shrink-0 text-2xl font-medium text-accent">
                    {index + 1}
                  </p>
                  <div className="min-w-0 flex-1">
                    <p className="text-[1.05rem] leading-snug text-ink">
                      <MixedText text={question.prompt} hebrewClassName="text-lg font-medium" />
                    </p>
                    <p
                      className="hebrew mt-3 rounded-xl bg-canvas px-3 py-2 text-right text-xl text-ink"
                      lang="he"
                      dir="rtl"
                    >
                      {question.hebrew}
                    </p>
                    <label className="sr-only" htmlFor={`exam-${question.id}`}>
                      Answer {index + 1}
                    </label>
                    <textarea
                      id={`exam-${question.id}`}
                      dir="ltr"
                      value={answers[index] ?? ''}
                      onChange={(event) => {
                        const next = [...answers]
                        next[index] = event.target.value
                        setAnswers(next)
                      }}
                      rows={3}
                      placeholder="English pshat"
                      className="mt-3 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink outline-none ring-accent/40 focus:ring-2"
                    />
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-full border border-line bg-card/95 px-3 py-2 shadow-[0_18px_40px_-24px_rgba(20,22,28,0.55)] backdrop-blur">
          <p className="min-w-0 flex-1 px-2 text-sm text-muted">
            {filled}/{QUESTIONS.length} answered
            {minutes > 0 ? ` · ${minutes} min` : ''}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="pressable rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            Hand it in
          </button>
        </div>
      </div>
    </AppFrame>
  )
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Could not read that photo.'))
    reader.readAsDataURL(file)
  })
}
