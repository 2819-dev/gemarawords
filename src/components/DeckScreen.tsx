import type { FormEvent } from 'react'
import type { Card } from '../lib/types.ts'

type DeckScreenProps = {
  cards: Card[]
  paste: string
  translating: boolean
  notice: string
  error: string
  onPasteChange: (value: string) => void
  onAdd: () => void
  onTranslationChange: (id: string, translation: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onStart: () => void
}

export function DeckScreen({
  cards,
  paste,
  translating,
  notice,
  error,
  onPasteChange,
  onAdd,
  onTranslationChange,
  onRemove,
  onClear,
  onStart,
}: DeckScreenProps) {
  const missing = cards.filter((card) => !card.translation.trim()).length
  const canStart = cards.length > 0 && missing === 0 && !translating

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onAdd()
  }

  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col gap-6 px-4 py-8">
      <header className="text-center">
        <p className="hebrew text-3xl text-burgundy" lang="he" dir="rtl">
          גמרא
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          Word Flashcards
        </h1>
        <p className="mt-2 text-ink-soft">
          Paste Hebrew words, check the translations, then start. Missed words
          come back more often until you keep getting them right.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-parchment-dark bg-card p-4 shadow-sm"
      >
        <label htmlFor="words" className="mb-2 block text-sm font-semibold">
          Add words
        </label>
        <textarea
          id="words"
          dir="rtl"
          lang="he"
          value={paste}
          onChange={(event) => onPasteChange(event.target.value)}
          placeholder="הדבק מילים כאן"
          rows={5}
          className="hebrew w-full resize-y rounded-xl border border-parchment-dark bg-parchment px-3 py-3 text-right text-2xl leading-relaxed text-ink outline-none ring-gold/40 focus:ring-2"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={translating}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-parchment disabled:opacity-50"
          >
            {translating ? 'Looking up…' : 'Add words'}
          </button>
          <p className="text-sm text-ink-soft">
            Duplicates are kept as one card.
          </p>
        </div>
      </form>

      {notice ? (
        <p className="rounded-xl bg-parchment-dark/60 px-3 py-2 text-sm">{notice}</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
      ) : null}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Deck{' '}
            <span className="text-ink-soft">({cards.length})</span>
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

        {cards.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-parchment-dark px-4 py-10 text-center text-ink-soft">
            No words yet. Paste a list from your Gemara and add them.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {cards.map((card) => (
              <li
                key={card.id}
                className="rounded-2xl border border-parchment-dark bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="hebrew text-3xl text-ink" lang="he" dir="rtl">
                    {card.hebrew}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(card.id)}
                    className="text-sm text-ink-soft hover:text-brick"
                    aria-label={`Remove ${card.hebrew}`}
                  >
                    Remove
                  </button>
                </div>
                <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Translation
                </label>
                <input
                  dir="ltr"
                  value={card.translation}
                  onChange={(event) =>
                    onTranslationChange(card.id, event.target.value)
                  }
                  placeholder="Add a translation"
                  className={`mt-1 w-full rounded-xl border bg-parchment px-3 py-2 text-ink outline-none ring-gold/40 focus:ring-2 ${
                    card.translation.trim()
                      ? 'border-parchment-dark'
                      : 'border-brick/50'
                  }`}
                />
                <p className="mt-1 text-xs text-ink-soft">
                  {sourceLabel(card)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="sticky bottom-4 mt-auto">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="w-full rounded-full bg-burgundy px-5 py-3 text-lg font-semibold text-parchment shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
        {missing > 0 ? (
          <p className="mt-2 text-center text-sm text-ink-soft">
            Fill in {missing} missing translation{missing === 1 ? '' : 's'} first.
          </p>
        ) : null}
      </div>
    </main>
  )
}

function sourceLabel(card: Card): string {
  if (card.source === 'sefaria') {
    return 'Filled from Sefaria (Jastrow / Klein). Edit if it is off.'
  }
  if (card.source === 'machine') {
    return 'Machine translation. Edit if it is off.'
  }
  if (card.source === 'none') {
    return 'No lookup found. Type the meaning yourself.'
  }
  return 'Edited by you.'
}
