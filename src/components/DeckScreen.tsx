import { useMemo, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { buildDafPack, PAGES, type DafPage } from '../lib/daf.ts'
import { questionFor } from '../lib/answer.ts'
import { MASTER_STREAK } from '../lib/scheduler.ts'
import type { Card, CardKind } from '../lib/types.ts'
import { AppFrame } from './AppFrame.tsx'
import { KindBadge } from './KindBadge.tsx'
import { MixedText } from './MixedText.tsx'

type DeckFilter = 'all' | CardKind

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
  const [filter, setFilter] = useState<DeckFilter>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const busy = translating || loadingDaf
  const missing = cards.filter((card) => !card.translation.trim()).length
  const canStart = cards.length > 0 && missing === 0 && !busy
  const selected = PAGES.find((page) => page.id === selectedPageId) ?? PAGES[0]
  const dafLoaded = cards.some((card) => card.id.startsWith('bm21b-'))
  const solid = cards.filter((card) => card.consecutiveCorrect >= MASTER_STREAK).length
  const shaky = cards.filter((card) => card.weight > 1).length

  const packPreview = useMemo(() => {
    const pack = buildDafPack(selectedPageId)
    return countsFor(pack)
  }, [selectedPageId])

  const deckCounts = countsFor(cards)
  const stats = cards.length > 0 ? deckCounts : packPreview

  const visibleCards = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return cards.filter((card) => {
      if (filter !== 'all' && card.kind !== filter) {
        return false
      }
      if (!needle) {
        return true
      }
      const haystack = `${card.hebrew} ${card.translation} ${questionFor(card)}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [cards, filter, query])

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

  return (
    <AppFrame>
      <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-8 px-4 py-6 pb-16 sm:px-6 sm:py-10">
        <header className="flex flex-col items-start gap-3">
          <p className="hebrew text-4xl leading-none text-burgundy" lang="he" dir="rtl">
            גמרא
          </p>
          <div>
            <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Words
            </h1>
            <div className="gold-rule mt-3 w-24" />
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
            A typed review of the sugya — words, lines of Gemara, and questions.
            Missed cards come back until you get them twice in a row.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-[1.75rem] border border-gold/35 bg-card shadow-[0_18px_40px_-24px_rgba(28,20,14,0.45)]">
          <p
            className="hebrew pointer-events-none absolute -bottom-6 -left-2 select-none text-[7.5rem] leading-none text-burgundy opacity-[0.08]"
            lang="he"
            dir="rtl"
            aria-hidden="true"
          >
            {selected?.chapter ?? 'גמרא'}
          </p>
          <div className="relative flex flex-col gap-5 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Today’s daf
              </p>
              {cards.length > 0 ? (
                <p className="text-sm text-ink-soft">
                  {solid} solid · {shaky} coming back
                </p>
              ) : null}
            </div>

            <label className="sr-only" htmlFor="daf">
              Page
            </label>
            <select
              id="daf"
              value={selectedPageId}
              onChange={(event) => onSelectPage(event.target.value)}
              className="font-display w-full appearance-none rounded-2xl border border-parchment-dark bg-parchment px-4 py-3 text-xl text-ink outline-none ring-gold/40 focus:ring-2"
            >
              {PAGES.map((page) => (
                <option key={page.id} value={page.id} disabled={!page.available}>
                  {pageLabel(page)}
                </option>
              ))}
            </select>

            {selected ? (
              <p className="hebrew text-right text-2xl text-ink" lang="he" dir="rtl">
                {selected.hebrewLabel}
                <span className="text-ink-soft"> · {selected.chapter}</span>
              </p>
            ) : null}

            <dl className="grid grid-cols-3 gap-2">
              <Stat label="Words" value={stats.words} />
              <Stat label="Gemara" value={stats.sentences} />
              <Stat label="Questions" value={stats.questions} />
            </dl>

            {missing > 0 ? (
              <p className="rounded-xl bg-brick/10 px-3 py-2 text-sm text-brick">
                {missing} card{missing === 1 ? '' : 's'} still need an answer before
                you can start.
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              {cards.length > 0 ? (
                <button
                  type="button"
                  onClick={onStart}
                  disabled={!canStart}
                  className="flex-1 rounded-full bg-burgundy px-5 py-3.5 text-lg font-semibold text-parchment shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Start reviewing
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy || !selected?.available}
                onClick={onLoadDaf}
                className={
                  cards.length === 0
                    ? 'flex-1 rounded-full bg-burgundy px-5 py-3.5 text-lg font-semibold text-parchment shadow-md disabled:opacity-50'
                    : 'rounded-full border border-ink/20 bg-parchment px-5 py-3.5 text-sm font-semibold text-ink disabled:opacity-50 sm:min-w-44'
                }
              >
                {loadingDaf
                  ? 'Loading daf…'
                  : dafLoaded
                    ? 'Reload this daf'
                    : 'Load this daf'}
              </button>
            </div>
          </div>
        </section>

        {notice ? (
          <p className="rounded-2xl bg-olive/10 px-4 py-3 text-sm text-olive">{notice}</p>
        ) : null}
        {error ? (
          <p className="rounded-2xl bg-brick/10 px-4 py-3 text-sm text-brick">{error}</p>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">Deck</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {cards.length === 0
                  ? 'Nothing loaded yet.'
                  : `${cards.length} cards · tap one to edit`}
              </p>
            </div>
            {cards.length > 0 ? (
              <button
                type="button"
                onClick={onClear}
                className="text-sm text-ink-soft underline-offset-2 hover:text-brick hover:underline"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {cards.length === 0 ? (
            <p className="rounded-[1.5rem] border border-dashed border-gold/50 bg-card/60 px-5 py-12 text-center text-ink-soft">
              Load Bava Metzia 21b to get Hebrew and Aramaic words, lines of
              Gemara, and questions from אלו מציאות.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {FILTERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                        filter === item.id
                          ? 'bg-ink text-parchment'
                          : 'border border-parchment-dark bg-card text-ink-soft hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label className="sr-only" htmlFor="deck-search">
                  Search the deck
                </label>
                <input
                  id="deck-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Hebrew or English"
                  className="w-full rounded-full border border-parchment-dark bg-card px-4 py-2.5 text-sm text-ink outline-none ring-gold/40 focus:ring-2"
                />
              </div>

              {visibleCards.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-parchment-dark px-4 py-8 text-center text-ink-soft">
                  No cards match that filter.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {visibleCards.map((card) => {
                    const open = openId === card.id
                    return (
                      <li
                        key={card.id}
                        className="overflow-hidden rounded-2xl border border-parchment-dark bg-card"
                      >
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => setOpenId(open ? null : card.id)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left"
                        >
                          <KindBadge kind={card.kind} />
                          <span className="min-w-0 flex-1">
                            <span
                              className="hebrew block text-right text-xl leading-snug text-ink"
                              lang="he"
                              dir="rtl"
                            >
                              {card.hebrew}
                            </span>
                            <span className="mt-1 block truncate text-sm text-ink-soft">
                              {card.translation.trim() || 'Needs an answer'}
                            </span>
                          </span>
                        </button>
                        {open ? (
                          <div className="border-t border-parchment-dark px-4 py-4">
                            <p className="text-sm leading-relaxed text-ink">
                              <MixedText
                                text={questionFor(card)}
                                hebrewClassName="text-base font-medium"
                              />
                            </p>
                            <label
                              className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink-soft"
                              htmlFor={`answer-${card.id}`}
                            >
                              Answer
                            </label>
                            <textarea
                              id={`answer-${card.id}`}
                              dir="ltr"
                              value={card.translation}
                              onChange={(event) =>
                                onTranslationChange(card.id, event.target.value)
                              }
                              rows={card.kind === 'word' ? 2 : 3}
                              className="mt-1 w-full rounded-xl border border-parchment-dark bg-parchment px-3 py-2 text-ink outline-none ring-gold/40 focus:ring-2"
                            />
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => onRemove(card.id)}
                                className="text-sm font-semibold text-ink-soft hover:text-brick"
                              >
                                Remove from deck
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}

              {canStart ? (
                <button
                  type="button"
                  onClick={onStart}
                  className="mt-2 w-full rounded-full bg-burgundy px-5 py-3 text-base font-semibold text-parchment"
                >
                  Start reviewing
                </button>
              ) : null}
            </>
          )}
        </section>

        <details className="rounded-[1.5rem] border border-parchment-dark bg-card p-5">
          <summary className="cursor-pointer font-semibold text-ink">
            Add your own words
          </summary>
          <p className="mt-2 text-sm text-ink-soft">
            Paste Hebrew or Aramaic, or drop an Excel / CSV file. Lookups go
            through Sefaria’s Jastrow.
          </p>
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
            className={`mt-4 ${
              dropping ? 'rounded-2xl ring-2 ring-burgundy ring-offset-4 ring-offset-card' : ''
            }`}
          >
            <textarea
              id="words"
              dir="rtl"
              lang="he"
              value={paste}
              onChange={(event) => onPasteChange(event.target.value)}
              placeholder="הדבק מילים בעברית או בארמית"
              rows={4}
              className="hebrew w-full resize-y rounded-2xl border border-parchment-dark bg-parchment px-3 py-3 text-right text-2xl leading-relaxed text-ink outline-none ring-gold/40 focus:ring-2"
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
      </main>
    </AppFrame>
  )
}

const FILTERS: { id: DeckFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'word', label: 'Words' },
  { id: 'sentence', label: 'Gemara' },
  { id: 'question', label: 'Questions' },
]

function countsFor(cards: Pick<Card, 'kind'>[]) {
  return {
    words: cards.filter((card) => card.kind === 'word').length,
    sentences: cards.filter((card) => card.kind === 'sentence').length,
    questions: cards.filter((card) => card.kind === 'question').length,
  }
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-parchment px-3 py-3 text-center">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </dt>
      <dd className="font-display mt-1 text-2xl font-medium text-ink">{value}</dd>
    </div>
  )
}

function pageLabel(page: DafPage): string {
  return `${page.label} — ${page.chapter}`
}
