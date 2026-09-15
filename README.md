# Gemara Word Flashcards

Paste Hebrew (or Aramaic) Gemara words, get translations, then study them as flashcards. Missed words come back more often until you keep getting them right. Duplicate words are merged into one card.

## Use it

1. Paste words (spaces or new lines).
2. Add words — translations fill in from [Sefaria](https://www.sefaria.org/) dictionaries (Jastrow first), with a machine-translate fallback.
3. Edit any gloss that looks wrong.
4. Press **Start**.
5. Tap a card to see the translation, then mark **Correct** or **Incorrect**.

Your deck stays in this browser (`localStorage`).

## Local development

```bash
npm install
npm test
npm run dev
```

The Vite dev server also handles `POST /api/translate`, so you do not need Netlify CLI for local study.

## Deploy on Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`

`netlify.toml` already sets the build, the translate function, and SPA redirects. No environment variables are required.
