# Gemara Word Flashcards

Paste Hebrew or Aramaic Gemara, upload Excel, or load a daf. Right now one page is ready: **Bava Metzia 21b (אלו מציאות)** — words, sentences, and questions mixed together. Lookups use Jastrow’s Talmudic dictionary (Hebrew and Aramaic), not modern-Hebrew translate.

## Use it

1. Choose **Bava Metzia 21b** and press **Load this daf**.
2. Study a mix of words (ייאוש שלא מדעת), sentences from the Gemara, and questions (“What does ye’ush shelo mida’as mean?”).
3. Tap a card for the answer, then mark **Correct** or **Incorrect**. Missed cards come back more often.
4. You can still paste extra words or upload `.xlsx` / `.csv` if you want.

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
