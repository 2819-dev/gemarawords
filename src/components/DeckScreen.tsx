import { useRef, useState, type DragEvent, type FormEvent } from 'react'
import { PAGES, type DafPage } from '../lib/daf.ts'
import { questionFor } from '../lib/answer.ts'
import type { Card } from '../lib/types.ts'
import { MixedText } from './MixedText.tsx'

type DeckScreenProps = {
  cards: Card[]
  paste: string
  translating: boolean
  loadingDaf: boolean
  selectedPageId: string
  notice: string
  error: string
  onSelectPage: (pageId: string) => void
  onLoadDaf: () => void
  onPasteChange: (value: string) => void
  onAdd: () => void
  onUpload: (file: File) => void
  onTranslationChange: (id: string, translation: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onStart: () => void
}

export function DeckScreen({
  cards,
  paste,
  translating,
  loadingDaf,
  selectedPageId,
  notice,
  error,
  onSelectPage,
  onLoadDaf,
  onPasteChange,
  onAdd,
  onUpload,
  onTranslationChange,
  onRemove,
  onClear,
  onStart,
}: DeckScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [dropping, setDropping] = useState(false)
  const busy = translating || loadingDaf
  const missing = cards.filter((card) => !card.translation.trim()).length
  const canStart = cards.length > 0 && missing === 0 && !busy
  const selected = PAGES.find((page) => page.id === selectedPageId) ?? PAGES[0]

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onAdd()
  }

  function takeFile(file: File | undefined) {
    if (!file || busy) {
      return
    }
    onUpload(file)
  }

  function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault()
    setDropping(false)
    takeFile(event.dataTransfer.files[0])
  }

  const wordCount = cards.filter((card) => card.kind === 'word').length
  const sentenceCount = cards.filter((card) => card.kind === 'sentence').length
  const questionCount = cards.filter((card) => card.kind === 'question').length

  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col gap-6 px-4 py-8">
      <header className="text-center">
        <p className="hebrew text-3xl text-burgundy" lang="he" dir="rtl">
          גמרא
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          Daf Flashcards
        </h1>
        <p className="mt-2 text-ink-soft">
          Pick a daf. You’ll get words, lines of Gemara, and questions on the
          sugya. Answers are in the language of the Gemara, not modern
          English. Type what you think; missed cards come back more often.
        </p>
      </header>

      <section className="rounded-2xl border border-parchment-dark bg-card p-4 shadow-sm">
        <label htmlFor="daf" className="mb-2 block text-sm font-semibold">
          Page
        </label>
        <select
          id="daf"
          value={selectedPageId}
          onChange={(event) => onSelectPage(event.target.value)}
          className="w-full rounded-xl border border-parchment-dark bg-parchment px-3 py-3 text-ink outline-none ring-gold/40 focus:ring-2"
        >
          {PAGES.map((page) => (
            <option key={page.id} value={page.id} disabled={!page.available}>
              {pageLabel(page)}
            </option>
          ))}
        </select>
        {selected ? (
          <p className="hebrew mt-2 text-right text-lg text-ink-soft" lang="he" dir="rtl">
            {selected.hebrewLabel} · {selected.chapter}
          </p>
        ) : null}
        <button
          type="button"
          disabled={busy || !selected?.available}
          onClick={onLoadDaf}
          className="mt-4 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-parchment disabled:opacity-50"
        >
          {loadingDaf ? 'Loading daf…' : 'Load this daf'}
        </button>
      </section>

      {notice ? (
        <p className="rounded-xl bg-parchment-dark/60 px-3 py-2 text-sm">{notice}</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
      ) : null}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Deck <span className="text-ink-soft">({cards.length})</span>
          </h2>
          {cards.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-ink-soft underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>
        {cards.length > 0 ? (
          <p className="text-sm text-ink-soft">
            {wordCount} words · {sentenceCount} sentences · {questionCount} questions
          </p>
        ) : null}

        {cards.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-parchment-dark px-4 py-10 text-center text-ink-soft">
            Load Bava Metzia 21b to get Hebrew and Aramaic words and phrases,
            sentences, and questions from אלו מציאות. If a piece only makes
            sense as part of an expression, it stays as that expression.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {cards.map((card) => (
              <li
                key={card.id}
                className="rounded-2xl border border-parchment-dark bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      {card.kind === 'sentence' ? 'gemara' : card.kind}
                    </p>
                    <p className="mt-1 text-lg text-ink">
                      <MixedText
                        text={questionFor(card)}
                        hebrewClassName="text-xl font-medium"
                      />
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(card.id)}
                    className="text-sm text-ink-soft hover:text-brick"
                    aria-label="Remove card"
                  >
                    Remove
                  </button>
                </div>
                <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Answer
                </label>
                <textarea
                  dir="ltr"
                  value={card.translation}
                  onChange={(event) =>
                    onTranslationChange(card.id, event.target.value)
                  }
                  rows={card.kind === 'word' ? 2 : 3}
                  className="mt-1 w-full rounded-xl border border-parchment-dark bg-parchment px-3 py-2 text-ink outline-none ring-gold/40 focus:ring-2"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="rounded-2xl border border-parchment-dark bg-card p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold">
          Or paste / upload extra Hebrew or Aramaic
        </summary>
        <form
          onSubmit={handleSubmit}
          onDragEnter={(event) => {
            event.preventDefault()
            setDropping(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDropping(true)
          }}
          onDragLeave={(event) => {
            if (event.currentTarget.contains(event.relatedTarget as Node)) {
              return
            }
            setDropping(false)
          }}
          onDrop={handleDrop}
          className={`mt-3 ${dropping ? 'rounded-xl border border-dashed border-burgundy p-2' : ''}`}
        >
          <textarea
            id="words"
            dir="rtl"
            lang="he"
            value={paste}
            onChange={(event) => onPasteChange(event.target.value)}
            placeholder="הדבק מילים בעברית או בארמית"
            rows={4}
            className="hebrew w-full resize-y rounded-xl border border-parchment-dark bg-parchment px-3 py-3 text-right text-2xl leading-relaxed text-ink outline-none ring-gold/40 focus:ring-2"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-parchment disabled:opacity-50"
            >
              {translating ? 'Looking up…' : 'Add words'}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              className="sr-only"
              onChange={(event) => {
                takeFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInput.current?.click()}
              className="rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
            >
              Upload Excel
            </button>
          </div>
        </form>
      </details>

      <div className="sticky bottom-4 mt-auto">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="w-full rounded-full bg-burgundy px-5 py-3 text-lg font-semibold text-parchment shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
      </div>
    </main>
  )
}

function pageLabel(page: DafPage): string {
  return `${page.label} — ${page.chapter}`
}
