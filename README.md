# Gemara Word Flashcards

Typed English flashcards for a daf: words, lines of Gemara, and questions on the sugya. Three dafim are ready:

- **Bava Metzia 25a (אלו מציאות)** — the default. Five sugyos: what you must announce, a vessel with produce in front, piles (number or place), coins stacked like towers, and three kings / one king.
- **Bava Metzia 21b (אלו מציאות)** — four sugyos: the machlokes, Rava’s sevara, the raayos, leket and fruit.
- **Bava Metzia 45a (הזהב)** — four sugyos: dinar for a dinar, the proof from perutos, first money / second money, and Yerushalayim and the gezeirah.

## Use it

1. Pick the daf.
2. Under **Ask me on**, tick the sugyos you want. Rounds only draw cards from those sugyos, and the Test Week bechina only has questions on them. Your choice is saved per daf.
3. Type the pshat in English. Misses come back more often until they are solid.
4. You can still paste extra words or upload `.xlsx` / `.csv`. They show up as their own **Your words** section. Lookups go to Sefaria’s Jastrow straight from the browser.

Everything stays in this browser (`localStorage`).

## Local development

```bash
npm install
npm test
npm run dev
```

## Deploy (GitHub Pages)

`.github/workflows/deploy-pages.yml` tests, builds, and publishes `dist` on every push to `main` (or run it by hand from the Actions tab).

One-time setup: in the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. The site will be at `https://<owner>.github.io/gemarawords/`.
