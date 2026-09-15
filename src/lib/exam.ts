import { checkAnswer } from './answer.ts'
import type { Card } from './types.ts'

export const EXAM_PASS_PERCENT = 70

export type ExamSection = {
  id: string
  title: string
  hint: string
}

export type ExamQuestion = {
  id: string
  sectionId: string
  hebrew: string
  prompt: string
  translation: string
  keywords: string[]
}

export type GradedExamItem = {
  question: ExamQuestion
  answer: string
  correct: boolean
}

export type ExamResult = {
  name: string
  takenAt: string
  minutes: number
  items: GradedExamItem[]
  correct: number
  total: number
  percent: number
  passed: boolean
  honor: string
}

export const EXAM_SECTIONS: ExamSection[] = [
  {
    id: 'machlokes',
    title: 'The machlokes',
    hint: 'Abaye, Rava, and where they actually argue',
  },
  {
    id: 'sevara',
    title: 'Rava’s sevara',
    hint: 'Why he counts ye’ush before the owner knows',
  },
  {
    id: 'raayos',
    title: 'The raayos',
    hint: 'Each mishna looks like Rava. Say why it is not.',
  },
  {
    id: 'leket',
    title: 'Leket and fruit',
    hint: 'Nemushot, poor people elsewhere, olives and figs',
  },
]

const QUESTIONS: ExamQuestion[] = [
  {
    id: 'exam-21b-define',
    sectionId: 'machlokes',
    hebrew: 'יֵאוּשׁ שֶׁלֹּא מִדַּעַת',
    prompt:
      'In English, what is ye’ush without knowledge? Say it as a pshat, not a translation of the words.',
    translation:
      'The owner has not yet found out that he lost the object, so he has not actually given up hope. The question is whether we already count that ye’ush.',
    keywords: ['does not know', 'didnt know', 'not yet', 'lost', 'give up hope'],
  },
  {
    id: 'exam-21b-sides',
    sectionId: 'machlokes',
    hebrew: 'אַבָּיֵי וְרָבָא',
    prompt:
      'Write both sides. What does Abaye hold, and what does Rava hold?',
    translation:
      'Abaye: it is not ye’ush, because the owner never actually gave up hope. Rava: it is ye’ush — at least when there is no siman — because when he finds out he will give up.',
    keywords: ['abaye', 'not yeush', 'rava', 'is yeush'],
  },
  {
    id: 'exam-21b-diyuk',
    sectionId: 'machlokes',
    hebrew: 'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    prompt:
      'Do they argue about an object that has a siman? What diyuk is the Gemara making?',
    translation:
      'No. Everyone agrees it is not ye’ush when there is a siman. The diyuk is that the machlokes is only when there is no siman.',
    keywords: ['no', 'everyone agrees', 'no siman', 'diyuk'],
  },
  {
    id: 'exam-21b-later',
    sectionId: 'machlokes',
    hebrew: 'אֲתָא לִידֵיהּ בְּאִיסּוּרָא',
    prompt:
      'A finder picked up a marked object before the owner knew it was missing. Later the owner gives up hope. May the finder keep it? Why?',
    translation:
      'No. It already came to the finder in issur. Once it reached him while still forbidden, later ye’ush does not help.',
    keywords: ['no', 'issur', 'came to', 'later', 'does not help'],
  },
  {
    id: 'exam-21b-when-yes',
    sectionId: 'machlokes',
    hebrew: 'מִידָּע יָדַע',
    prompt:
      'If the owner already knows he lost something with no siman, do Abaye and Rava still argue?',
    translation:
      'No. Then it is ordinary ye’ush, a loss with knowledge. They only argue when he does not yet know.',
    keywords: ['no', 'ordinary', 'knows', 'midaas', 'only', 'does not know'],
  },
  {
    id: 'exam-21b-rava-why',
    sectionId: 'sevara',
    hebrew: 'סִימָנָא לֵית לִי בְּגַוֵּיהּ',
    prompt:
      'Rava says it is already ye’ush even though the owner does not know yet. In English, what is he counting on?',
    translation:
      'When the owner finds out, he will say he has no siman in it and he will give up hope. Rava counts that future ye’ush now.',
    keywords: ['finds out', 'no siman', 'give up hope', 'future'],
  },
  {
    id: 'exam-21b-kav',
    sectionId: 'sevara',
    hebrew: 'כַּבָּא דְחִטֵּי',
    prompt:
      'What mashal does Rava give, and what does it prove?',
    translation:
      'A kav of wheat that fell into a pile. The owner cannot pick out his own, so he says he has no siman and gives up hope. That is why no-siman is already ye’ush.',
    keywords: ['kav', 'wheat', 'pile', 'no siman', 'give up hope', 'mashal'],
  },
  {
    id: 'exam-21b-fruit',
    sectionId: 'raayos',
    hebrew: 'פֵּירוֹת מְפוּזָּרִין',
    prompt:
      'Scattered fruit in the mishna looks like a raayah for Rava. What is the hava amina, and how does the Gemara knock it out?',
    translation:
      'The hava amina is that the owner did not know they fell, so the finder keeping them would be ye’ush without knowledge. The Gemara says it is leftover grain on the threshing floor — a loss he knew about.',
    keywords: ['threshing floor', 'knew', 'midaas', 'not a raayah', 'leftover'],
  },
  {
    id: 'exam-21b-maknishata',
    sectionId: 'raayos',
    hebrew: 'מַכְנַשְׁתָּא דְּבֵי דָרֵי',
    prompt:
      'What is leftover grain on the threshing floor, and why does that matter for the raayah?',
    translation:
      'Sweepings the owner knew he was leaving. Because he knew, it is not ye’ush without knowledge, so it cannot prove Rava.',
    keywords: ['threshing floor', 'knew', 'leaving', 'not shelo', 'not a raayah'],
  },
  {
    id: 'exam-21b-coins',
    sectionId: 'raayos',
    hebrew: 'מָעוֹת מְפוּזָּרוֹת',
    prompt:
      'Why may the finder keep scattered coins, and why is that still not a raayah for Rava?',
    translation:
      'A person is used to feeling his pocket, so he knows they fell. The finder keeps them because of ye’ush with knowledge, not ye’ush without knowledge.',
    keywords: ['pocket', 'knows', 'not shelo', 'not a raayah'],
  },
  {
    id: 'exam-21b-heavy',
    sectionId: 'raayos',
    hebrew: 'עִיגּוּלֵי דְבֵילָה',
    prompt:
      'Fig cakes and a baker’s loaves belong to the finder. Why, and why is that not Rava’s case?',
    translation:
      'They are heavy, so the owner knows when they fall. That is a loss with knowledge, not ye’ush without knowledge.',
    keywords: ['heavy', 'knows', 'not shelo', 'not a raayah'],
  },
  {
    id: 'exam-21b-purple',
    sectionId: 'raayos',
    hebrew: 'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן',
    prompt:
      'Strips of purple wool belong to the finder. Why does the owner know they fell?',
    translation:
      'They are important, so he feels around for them and knows they are missing. Not ye’ush without knowledge.',
    keywords: ['important', 'feels', 'knows', 'not shelo'],
  },
  {
    id: 'exam-21b-shul',
    sectionId: 'raayos',
    hebrew: 'מָעוֹת בְּבָתֵּי כְנֵסִיּוֹת',
    prompt:
      'Coins left in a shul or beis medrash belong to the finder. Is that a raayah that ye’ush without knowledge works?',
    translation:
      'No. The owners give up hope because they know they lost them there. It is ordinary ye’ush, not without knowledge.',
    keywords: ['no', 'they know', 'give up hope', 'not a raayah', 'ordinary'],
  },
  {
    id: 'exam-21b-sea',
    sectionId: 'raayos',
    hebrew: 'זוּטוֹ שֶׁל יָם',
    prompt:
      'You find something in the wash of the sea or the overflow of a river, and it even has a siman. May you keep it, and can Rava use that as a raayah?',
    translation:
      'Yes, you may keep it: the Torah itself is matir it. Rava cannot use it, because it is not a stam ye’ush case.',
    keywords: ['yes', 'torah', 'matir', 'permits', 'not a raayah', 'stam'],
  },
  {
    id: 'exam-21b-nemushot',
    sectionId: 'leket',
    hebrew: 'נָמוֹשׁוֹת',
    prompt:
      'Who are the nemushot according to Rabbi Yochanan, and according to Reish Lakish?',
    translation:
      'Rabbi Yochanan: old people walking with a cane. Reish Lakish: people who do leket after the leket.',
    keywords: ['old', 'cane', 'leket', 'yochanan', 'reish lakish'],
  },
  {
    id: 'exam-21b-aniyim',
    sectionId: 'leket',
    hebrew: 'עֲנִיִּים בְּדוּכְתָּא אַחְרִיתָא',
    prompt:
      'After the nemushot have gone, why is the leket mutar even though poor people somewhere else did not know?',
    translation:
      'The poor people here already gave up hope, and the ones elsewhere assumed the local poor would take it.',
    keywords: ['gave up hope', 'local', 'assumed', 'mutar', 'somewhere else'],
  },
  {
    id: 'exam-21b-olives',
    sectionId: 'leket',
    hebrew: 'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    prompt:
      'Olives under the tree are assur. A fig that fell is mutar. In English, why the difference?',
    translation:
      'An olive’s look proves whose it is, so the owner does not give up. A fig becomes repulsive when it falls, so he does.',
    keywords: ['look proves', 'fig', 'repulsive', 'olive', 'assur', 'mutar'],
  },
]

export const EXAM_TITLE = 'Bava Metzia 21b'
export const EXAM_HEBREW = 'בבא מציעא כ״א ע״ב'
export const EXAM_CHAPTER = 'אלו מציאות'
export const EXAM_SUBTITLE = 'Test Week bechina'

export function examQuestions(): ExamQuestion[] {
  return QUESTIONS
}

export function examCard(question: ExamQuestion): Card {
  return {
    id: question.id,
    kind: 'question',
    hebrew: question.hebrew,
    prompt: question.prompt,
    translation: question.translation,
    keywords: question.keywords,
    weight: 1,
    consecutiveCorrect: 0,
    source: 'sefaria',
  }
}

export function examHonor(percent: number): string {
  if (percent >= 100) {
    return 'Clean bechina'
  }
  if (percent >= 85) {
    return 'Solid in the sugya'
  }
  if (percent >= EXAM_PASS_PERCENT) {
    return 'Knows the pshat'
  }
  return 'Needs another sitting'
}

export function gradeExam(
  answers: string[],
  name: string,
  minutes = 0,
  takenAt = new Date().toISOString(),
): ExamResult {
  const items = QUESTIONS.map((question, index) => {
    const answer = answers[index] ?? ''
    return {
      question,
      answer,
      correct: checkAnswer(examCard(question), answer).correct,
    }
  })
  const correct = items.filter((item) => item.correct).length
  const total = items.length
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  return {
    name: name.trim() || 'Talmid',
    takenAt,
    minutes,
    items,
    correct,
    total,
    percent,
    passed: percent >= EXAM_PASS_PERCENT,
    honor: examHonor(percent),
  }
}

export function parseAnswerSheet(text: string): string[] {
  const answers = QUESTIONS.map(() => '')
  const pattern = /(?:^|\n)\s*(?:q(?:uestion)?\s*)?(\d{1,2})\s*[.):\-\]]\s*/gi
  const matches = [...text.matchAll(pattern)]
  if (matches.length === 0) {
    const trimmed = text.trim()
    if (trimmed) {
      answers[0] = trimmed
    }
    return answers
  }

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i]
    const number = Number(match[1])
    const start = (match.index ?? 0) + match[0].length
    const end = i + 1 < matches.length ? (matches[i + 1]?.index ?? text.length) : text.length
    if (number >= 1 && number <= answers.length) {
      answers[number - 1] = text.slice(start, end).trim()
    }
  }
  return answers
}

export function answeredCount(answers: string[]): number {
  return answers.filter((answer) => answer.trim().length > 0).length
}

export function downloadBlob(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function examAnswerSheet(): string {
  const lines = [
    `${EXAM_TITLE} · ${EXAM_CHAPTER}`,
    EXAM_SUBTITLE,
    'Write the pshat in English. Number your answers 1–17.',
    '',
    'Name:',
    '',
  ]
  QUESTIONS.forEach((question, index) => {
    lines.push(`${index + 1}. ${question.prompt}`)
    lines.push(`   ${question.hebrew}`)
    lines.push('')
    lines.push('')
  })
  return `${lines.join('\n')}\n`
}

export function examPacketHtml(): string {
  const sections = EXAM_SECTIONS.map((section) => {
    const items = QUESTIONS.filter((question) => question.sectionId === section.id)
    const body = items
      .map((question) => {
        const number = QUESTIONS.indexOf(question) + 1
        return `<article class="q">
  <p class="num">${number}.</p>
  <div class="body">
    <p class="prompt">${escapeHtml(question.prompt)}</p>
    <p class="he" lang="he" dir="rtl">${escapeHtml(question.hebrew)}</p>
    <div class="lines" aria-hidden="true"></div>
  </div>
</article>`
      })
      .join('\n')
    return `<section>
  <h2>${escapeHtml(section.title)}</h2>
  <p class="hint">${escapeHtml(section.hint)}</p>
  ${body}
</section>`
  }).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${EXAM_TITLE} · Test Week bechina</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: "Source Sans 3", "Helvetica Neue", sans-serif; color: #14161c; margin: 40px auto; max-width: 740px; }
    h1 { font-family: Georgia, serif; font-size: 2rem; margin: 0; }
    .kicker { letter-spacing: .22em; text-transform: uppercase; font-size: 11px; color: #9b2034; font-weight: 700; }
    .meta { display: flex; gap: 24px; margin: 18px 0 28px; font-size: 15px; }
    .meta span { flex: 1; border-bottom: 1px solid #14161c; padding: 4px 0; }
    h2 { font-family: Georgia, serif; font-size: 1.25rem; margin: 28px 0 4px; }
    .hint { color: #5c6370; margin: 0 0 14px; }
    .he { font-family: "Frank Ruhl Libre", "Times New Roman", serif; font-size: 1.35rem; }
    .q { display: grid; grid-template-columns: 2rem 1fr; gap: 8px; margin: 0 0 22px; break-inside: avoid; }
    .num { font-weight: 700; margin: 0; }
    .prompt { margin: 0 0 8px; line-height: 1.45; }
    .lines { height: 72px; background: repeating-linear-gradient(transparent, transparent 23px, #dde1e8 24px); }
    footer { margin-top: 36px; font-size: 13px; color: #5c6370; }
    @media print { body { margin: 16px auto; } }
  </style>
</head>
<body>
  <p class="kicker">Test Week · Gemara Words</p>
  <h1>${EXAM_TITLE}</h1>
  <p lang="he" dir="rtl" class="he">${EXAM_HEBREW} · ${EXAM_CHAPTER}</p>
  <p>Write the pshat in English. Hebrew in the question stays in Gemara order. Do not copy the line — say what it means.</p>
  <div class="meta"><span>Name</span><span>Date</span></div>
  ${sections}
  <footer>17 questions · answers in English · Bava Metzia 21b / אלו מציאות</footer>
</body>
</html>`
}

export function certificateHtml(result: ExamResult): string {
  const date = new Date(result.takenAt)
  const when = Number.isNaN(date.getTime())
    ? result.takenAt
    : date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
  const timeLine =
    result.minutes > 0 ? ` · ${result.minutes} min` : ''

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Bechina certificate · ${escapeHtml(result.name)}</title>
  <style>
    body { font-family: Georgia, serif; background: #f3f5f8; color: #14161c; margin: 0; }
    .sheet { max-width: 820px; margin: 32px auto; background: #fff; border: 12px solid #9b2034; padding: 48px 56px; text-align: center; }
    .kicker { letter-spacing: .28em; text-transform: uppercase; font-size: 12px; color: #9b2034; font-weight: 700; font-family: "Helvetica Neue", sans-serif; }
    h1 { font-size: 2.8rem; margin: 12px 0 8px; }
    .he { font-size: 2rem; margin: 0 0 24px; }
    .name { font-size: 2.2rem; border-bottom: 1px solid #14161c; display: inline-block; min-width: 240px; padding: 0 12px 4px; }
    .honor { font-size: 1.6rem; color: #9b2034; margin: 28px 0 8px; }
    .score { font-size: 3rem; margin: 8px 0; }
    .seal { width: 88px; height: 88px; border: 3px solid #9b2034; border-radius: 50%; margin: 28px auto 0; display: flex; align-items: center; justify-content: center; color: #9b2034; font-weight: 700; letter-spacing: .12em; font-size: 12px; font-family: "Helvetica Neue", sans-serif; }
    p { line-height: 1.5; }
    @media print { body { background: #fff; } .sheet { margin: 0; border-width: 10px; } }
  </style>
</head>
<body>
  <div class="sheet">
    <p class="kicker">Gemara Words · Test Week</p>
    <h1>Bechina Certificate</h1>
    <p class="he" lang="he" dir="rtl">${EXAM_HEBREW}</p>
    <p>This certifies that</p>
    <p class="name">${escapeHtml(result.name)}</p>
    <p>sat the bechina on ${EXAM_TITLE} · ${EXAM_CHAPTER} and can say the pshat of the sugya in English.</p>
    <p class="honor">${escapeHtml(result.honor)}</p>
    <p class="score">${result.correct}<span style="font-size:1.4rem;color:#5c6370">/${result.total}</span></p>
    <p>${result.percent}%${timeLine} · ${escapeHtml(when)}</p>
    <div class="seal">${result.passed ? 'PASSED' : 'SIT AGAIN'}</div>
  </div>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
