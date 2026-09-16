import { useMemo, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { buildDafPack, PAGES, type DafPage } from '../lib/daf.ts'
import { questionFor } from '../lib/answer.ts'
import { MASTER_STREAK } from '../lib/scheduler.ts'
import { roundHeadline, type RoundSummary } from '../lib/session.ts'
import type { ExamResult } from '../lib/exam.ts'
import type { Card, CardKind } from '../lib/types.ts'
import { AppFrame } from './AppFrame.tsx'
import { KindBadge } from './KindBadge.tsx'
import { MixedText } from './MixedText.tsx'

type DeckFilter = 'all' | CardKind | 'back'

type DeckScreenProps = {
  cards: Card[]
  paste: string
  translating: boolean
  loadingDaf: boolean
  selectedPageId: string
  notice: string
  error: string
  lastRound: RoundSummary | null
  lastExam: ExamResult | null
  onSelectPage: (pageId: string) => void
  onLoadDaf: () => void
  onPasteChange: (value: string) => void
  onAdd: () => void
  onUpload: (file: File) => void
  onTranslationChange: (id: string, translation: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onStart: () => void
  onExam: () => void
  onCertificate: () => void
}

const RAIL: Record<CardKind, string> = {
  word: 'bg-accent',
  sentence: 'bg-mark',
  question: 'bg-ok',
}

export function DeckScreen({
  cards,
  paste,
  translating,
  loadingDaf,
  selectedPageId,
  notice,
  error,
  lastRound,
  lastExam,
  onSelectPage,
  onLoadDaf,
  onPasteChange,
  onAdd,
  onUpload,
  onTranslationChange,
  onRemove,
  onClear,
  onStart,
  onExam,
  onCertificate,
}: DeckScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [dropping, setDropping] = useState(false)
  const [filter, setFilter] = useState<DeckFilter>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAllCards, setShowAllCards] = useState(false)
  const busy = translating || loadingDaf
  const missing = cards.filter((card) => !card.translation.trim()).length
  const canStart = cards.length > 0 && missing === 0 && !busy
  const selected = PAGES.find((page) => page.id === selectedPageId) ?? PAGES[0]
  const dafLoaded = cards.some((card) => card.id.startsWith('bm21b-'))
  const solid = cards.filter((card) => card.consecutiveCorrect >= MASTER_STREAK).length
  const shaky = cards.filter((card) => card.weight > 1).length
  const comingBack = cards.filter(
    (card) => card.weight > 1 || card.consecutiveCorrect === 1,
  ).length
  const remaining = Math.max(0, cards.length - solid)

  const packPreview = useMemo(() => {
    const pack = buildDafPack(selectedPageId)
    return countsFor(pack)
  }, [selectedPageId])

  const deckCounts = countsFor(cards)
  const stats = cards.length > 0 ? deckCounts : packPreview

  const visibleCards = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return cards.filter((card) => {
      if (filter === 'back') {
        const comingBack = card.weight > 1 || card.consecutiveCorrect === 1
        if (!comingBack) {
          return false
        }
      } else if (filter !== 'all' && card.kind !== filter) {
        return false
      }
      if (!needle) {
        return true
      }
      const haystack = `${card.hebrew} ${card.translation} ${questionFor(card)}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [cards, filter, query])

  const listedCards = useMemo(() => {
    const previewing = !showAllCards && filter === 'all' && !query.trim()
    if (!previewing) {
      return visibleCards
    }
    return visibleCards.slice(0, 6)
  }, [filter, query, showAllCards, visibleCards])

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
      <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-6 px-4 py-6 pb-28 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                Gemara Words
              </p>
              <h1 className="font-display mt-1 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Learn the sugya
              </h1>
            </div>
            <p className="hebrew text-5xl leading-none text-accent" lang="he" dir="rtl">
              גמרא
            </p>
          </div>
          <div className="accent-rule w-28" />
          <p className="max-w-lg text-[1.05rem] leading-relaxed text-muted">
            Eight cards at a time. Type the pshat in English. Misses come back
            until they’re solid.
          </p>
        </header>

        <section className="quiz-card relative overflow-hidden">
          <p
            className="hebrew pointer-events-none absolute -bottom-8 -left-3 select-none text-[8rem] leading-none text-accent opacity-[0.06]"
            lang="he"
            dir="rtl"
            aria-hidden="true"
          >
            {selected?.chapter ?? 'גמרא'}
          </p>
          <div className="relative flex flex-col gap-5 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                Today’s sugya
              </p>
              {cards.length > 0 ? (
                <p className="rounded-full bg-canvas px-3 py-1 text-sm text-muted">
                  {remaining === 0 ? 'All solid' : `${remaining} still open`}
                </p>
              ) : (
                <p className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                  Ready to load
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {cards.length > 0 ? (
                <div className="flex justify-center sm:block">
                  <ProgressRing value={solid} total={cards.length} />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <label className="sr-only" htmlFor="daf">
                  Page
                </label>
                <select
                  id="daf"
                  value={selectedPageId}
                  onChange={(event) => onSelectPage(event.target.value)}
                  className="font-display w-full appearance-none rounded-2xl border border-line bg-canvas px-4 py-3 text-lg text-ink outline-none ring-accent/40 focus:ring-2 sm:text-xl"
                >
                  {PAGES.map((page) => (
                    <option key={page.id} value={page.id} disabled={!page.available}>
                      {pageLabel(page)}
                    </option>
                  ))}
                </select>
                {selected ? (
                  <p className="hebrew mt-3 text-right text-2xl text-ink" lang="he" dir="rtl">
                    {selected.hebrewLabel}
                    <span className="text-muted"> · {selected.chapter}</span>
                  </p>
                ) : null}
                {cards.length > 0 ? (
                  <p className="mt-2 text-sm text-muted">
                    {solid} solid
                    {shaky > 0 ? ` · ${shaky} coming back` : ''}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted">
                    Words, lines of Gemara, and questions from the daf.
                  </p>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-2">
              <Stat label="Words" value={stats.words} hint="terms" />
              <Stat label="Gemara" value={stats.sentences} hint="lines" />
              <Stat label="Questions" value={stats.questions} hint="raayos" />
            </dl>

            {cards.length > 0 ? <KindPath cards={cards} /> : null}

            {lastRound && lastRound.reviewed > 0 ? (
              <p className="text-sm text-muted">
                Last sitting: {roundHeadline(lastRound)} · {lastRound.correct} of{' '}
                {lastRound.reviewed}
              </p>
            ) : null}

            {missing > 0 ? (
              <p className="rounded-xl bg-bad/10 px-3 py-2 text-sm text-bad">
                {missing} card{missing === 1 ? '' : 's'} still need an answer before
                you can start.
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {cards.length > 0 ? (
                <button
                  type="button"
                  onClick={onStart}
                  disabled={!canStart}
                  className="pressable flex-1 rounded-full bg-accent px-5 py-3.5 text-lg font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {startLabel(solid, cards.length, shaky, lastRound)}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy || !selected?.available}
                  onClick={onLoadDaf}
                  className="pressable flex-1 rounded-full bg-accent px-5 py-3.5 text-lg font-semibold text-white shadow-md disabled:opacity-50"
                >
                  {loadingDaf ? 'Loading daf…' : 'Load this daf'}
                </button>
              )}
              {cards.length > 0 ? (
                <button
                  type="button"
                  disabled={busy || !selected?.available}
                  onClick={onLoadDaf}
                  className="text-sm font-semibold text-muted hover:text-ink disabled:opacity-50"
                >
                  {loadingDaf ? 'Loading…' : dafLoaded ? 'Reload daf' : 'Load daf'}
                </button>
              ) : null}
            </div>
          </div>
        </section>

        {notice ? (
          <p className="rounded-2xl bg-ok/10 px-4 py-3 text-sm text-ok">{notice}</p>
        ) : null}
        {error ? (
          <p className="rounded-2xl bg-bad/10 px-4 py-3 text-sm text-bad">{error}</p>
        ) : null}

        <section className="quiz-card flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                Test Week
              </p>
              <p className="font-display mt-1 text-xl font-medium text-ink">
                {lastExam ? lastExam.honor : 'Sit the bechina'}
              </p>
              <p className="text-sm text-muted">
                {lastExam
                  ? `${lastExam.correct}/${lastExam.total} last time`
                  : '17 questions · when the pshat is in your mouth'}
              </p>
            </div>
            <div className="flex gap-2">
              {lastExam ? (
                <button
                  type="button"
                  onClick={onCertificate}
                  className="pressable rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm font-semibold text-ink"
                >
                  Certificate
                </button>
              ) : null}
              <button
                type="button"
                onClick={onExam}
                className="pressable rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
              >
                {lastExam ? 'Sit it again' : 'Open'}
              </button>
            </div>
          </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">Deck</h2>
              <p className="mt-1 text-sm text-muted">
                {cards.length === 0
                  ? 'Nothing loaded yet.'
                  : `${cards.length} cards · tap one to peek`}
              </p>
            </div>
            {cards.length > 0 ? (
              <button
                type="button"
                onClick={onClear}
                className="text-sm text-muted underline-offset-2 hover:text-bad hover:underline"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {cards.length === 0 ? (
            <p className="rounded-[1.5rem] border border-dashed border-line bg-card/70 px-5 py-12 text-center text-muted">
              Load Bava Metzia 21b and start with the terms, then the Gemara,
              then the raayos.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {FILTERS.map((item) => {
                    const label =
                      item.id === 'back' && comingBack > 0
                        ? `${item.label} (${comingBack})`
                        : item.label
                    return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                        filter === item.id
                          ? 'bg-ink text-white'
                          : 'border border-line bg-card text-muted hover:text-ink'
                      }`}
                    >
                      {label}
                    </button>
                    )
                  })}
                </div>
                <label className="sr-only" htmlFor="deck-search">
                  Search the deck
                </label>
                <input
                  id="deck-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Hebrew or English"
                  className="w-full rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none ring-accent/40 focus:ring-2"
                />
              </div>

              {visibleCards.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-muted">
                  No cards match that filter.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {listedCards.map((card) => {
                    const open = openId === card.id
                    return (
                      <li
                        key={card.id}
                        className="overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-[0_12px_28px_-22px_rgba(20,22,28,0.45)]"
                      >
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => setOpenId(open ? null : card.id)}
                          className="flex w-full items-stretch text-left"
                        >
                          <span className={`w-1.5 shrink-0 ${RAIL[card.kind]}`} aria-hidden="true" />
                          <span className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3">
                            <span className="flex shrink-0 flex-col items-start gap-1">
                              <KindBadge kind={card.kind} />
                              <CardStatus card={card} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className="hebrew block text-right text-xl leading-snug text-ink"
                                lang="he"
                                dir="rtl"
                              >
                                {card.hebrew}
                              </span>
                              <span className="mt-1 block truncate text-sm text-muted">
                                {card.translation.trim() ? (
                                  <MixedText text={card.translation} />
                                ) : (
                                  'Needs an answer'
                                )}
                              </span>
                            </span>
                          </span>
                        </button>
                        {open ? (
                          <div className="border-t border-line px-4 py-4">
                            <p className="text-sm leading-relaxed text-ink">
                              <MixedText
                                text={questionFor(card)}
                                hebrewClassName="text-base font-medium"
                              />
                            </p>
                            <label
                              className="mt-3 block text-xs font-semibold uppercase tracking-wide text-muted"
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
                              className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink outline-none ring-accent/40 focus:ring-2"
                            />
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => onRemove(card.id)}
                                className="text-sm font-semibold text-muted hover:text-bad"
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

              {visibleCards.length > listedCards.length ? (
                <button
                  type="button"
                  onClick={() => setShowAllCards(true)}
                  className="pressable rounded-full border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink"
                >
                  Show all {visibleCards.length} cards
                </button>
              ) : null}
              {showAllCards && filter === 'all' && !query.trim() ? (
                <button
                  type="button"
                  onClick={() => setShowAllCards(false)}
                  className="text-sm font-semibold text-muted hover:text-ink"
                >
                  Show fewer
                </button>
              ) : null}
            </>
          )}
        </section>

        <details className="rounded-[1.5rem] border border-line bg-card p-5">
          <summary className="cursor-pointer font-semibold text-ink">
            Add your own words
          </summary>
          <p className="mt-2 text-sm text-muted">
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
              dropping ? 'rounded-2xl ring-2 ring-accent ring-offset-4 ring-offset-card' : ''
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
              className="hebrew w-full resize-y rounded-2xl border border-line bg-canvas px-3 py-3 text-right text-2xl leading-relaxed text-ink outline-none ring-accent/40 focus:ring-2"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busy}
                className="pressable rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
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
                className="pressable rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
              >
                Upload Excel
              </button>
            </div>
          </form>
        </details>
      </main>
      {canStart ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden">
          <button
            type="button"
            onClick={onStart}
            className="pointer-events-auto pressable w-full max-w-2xl rounded-full bg-accent px-5 py-3.5 text-base font-semibold text-white shadow-md"
          >
            {startLabel(solid, cards.length, shaky, lastRound)}
          </button>
        </div>
      ) : null}
    </AppFrame>
  )
}

const FILTERS: { id: DeckFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'word', label: 'Words' },
  { id: 'sentence', label: 'Gemara' },
  { id: 'question', label: 'Questions' },
  { id: 'back', label: 'Coming back' },
]

function countsFor(cards: Pick<Card, 'kind'>[]) {
  return {
    words: cards.filter((card) => card.kind === 'word').length,
    sentences: cards.filter((card) => card.kind === 'sentence').length,
    questions: cards.filter((card) => card.kind === 'question').length,
  }
}

function KindPath({ cards }: { cards: Card[] }) {
  const rows: { kind: CardKind; label: string; bar: string }[] = [
    { kind: 'word', label: 'Terms', bar: 'bg-accent' },
    { kind: 'sentence', label: 'Gemara', bar: 'bg-mark' },
    { kind: 'question', label: 'Raayos', bar: 'bg-ok' },
  ]
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((row) => {
        const ofKind = cards.filter((card) => card.kind === row.kind)
        const solid = ofKind.filter(
          (card) => card.consecutiveCorrect >= MASTER_STREAK,
        ).length
        const percent = ofKind.length === 0 ? 0 : solid / ofKind.length
        return (
          <div key={row.kind}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              <span>{row.label}</span>
              <span>
                {solid}/{ofKind.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full ${row.bar}`}
                style={{ width: `${percent * 100}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CardStatus({ card }: { card: Card }) {
  if (card.consecutiveCorrect >= MASTER_STREAK) {
    return <span className="text-[11px] font-semibold text-ok">Solid</span>
  }
  if (card.weight > 1) {
    return <span className="text-[11px] font-semibold text-accent">Back</span>
  }
  if (card.consecutiveCorrect === 1) {
    return <span className="text-[11px] font-semibold text-mark">1 more</span>
  }
  return null
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: number
  hint: string
}) {
  return (
    <div className="rounded-2xl bg-canvas px-3 py-3 text-center">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="font-display mt-1 text-2xl font-medium text-ink">{value}</dd>
      <p className="mt-0.5 text-[11px] text-muted">{hint}</p>
    </div>
  )
}

function ProgressRing({ value, total }: { value: number; total: number }) {
  const size = 76
  const stroke = 7
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const percent = total === 0 ? 0 : Math.min(1, value / total)
  return (
    <div className="relative h-[76px] w-[76px] shrink-0" aria-hidden="true">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent)}
        />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center font-display text-xl font-medium text-ink">
        {Math.round(percent * 100)}
        <span className="text-[10px] text-muted">%</span>
      </p>
    </div>
  )
}

function startLabel(
  solid: number,
  total: number,
  shaky: number,
  lastRound: RoundSummary | null,
): string {
  if (total > 0 && solid >= total) {
    return 'Review again'
  }
  if (solid > 0 || shaky > 0 || (lastRound && lastRound.reviewed > 0)) {
    return 'Keep going'
  }
  return 'Learn this sugya'
}

function pageLabel(page: DafPage): string {
  return page.label
}
