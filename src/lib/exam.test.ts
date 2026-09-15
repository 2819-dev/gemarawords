import { describe, expect, it } from 'vitest'
import {
  EXAM_PASS_PERCENT,
  answeredCount,
  examHonor,
  examPacketHtml,
  examQuestions,
  gradeExam,
  parseAnswerSheet,
} from './exam.ts'

describe('exam pack', () => {
  it('is a full English bechina on 21b', () => {
    const questions = examQuestions()
    expect(questions.length).toBe(17)
    expect(new Set(questions.map((question) => question.id)).size).toBe(17)
    expect(
      questions.every((question) => !/[\u0590-\u05FF]/.test(question.translation)),
    ).toBe(true)
    expect(
      questions.every((question) => question.prompt.trim().length > 40 && question.keywords.length > 0),
    ).toBe(true)
    expect(questions.some((question) => /diyuk/i.test(question.prompt))).toBe(true)
    expect(questions.some((question) => /raayah/i.test(question.prompt))).toBe(true)
    expect(questions.some((question) => /threshing floor/i.test(question.translation))).toBe(
      true,
    )
  })
})

describe('parseAnswerSheet', () => {
  it('reads numbered answers without copying leftover prompts', () => {
    const parsed = parseAnswerSheet(`Name: Hillel

1. The owner does not know he lost it yet.
2) Abaye says it is not yeush. Rava says it is yeush.
Q3. No. Everyone agrees. The diyuk is no siman.
10. A person feels his pocket so he knows.
17. An olive's look proves whose it is. A fig becomes repulsive.
`)
    expect(parsed[0]).toMatch(/does not know/i)
    expect(parsed[1]).toMatch(/abaye/i)
    expect(parsed[2]).toMatch(/diyuk/i)
    expect(parsed[9]).toMatch(/pocket/i)
    expect(parsed[16]).toMatch(/fig/i)
    expect(parsed[3]).toBe('')
  })

  it('ignores numbers in the middle of an answer', () => {
    const parsed = parseAnswerSheet(`1. There are 2 sides here, Abaye and Rava.
2. Only when there is no siman.`)
    expect(parsed[0]).toMatch(/2 sides/i)
    expect(parsed[1]).toMatch(/no siman/i)
  })
})

describe('gradeExam', () => {
  it('scores a strong English bechina as a pass', () => {
    const answers = examQuestions().map((question) => question.translation)
    const result = gradeExam(answers, 'Hillel', 24)
    expect(result.correct).toBe(result.total)
    expect(result.percent).toBe(100)
    expect(result.passed).toBe(true)
    expect(result.honor).toBe('Clean bechina')
    expect(result.name).toBe('Hillel')
    expect(result.minutes).toBe(24)
  })

  it('fails a mostly blank sheet', () => {
    const result = gradeExam(['I do not know'], 'Talmid')
    expect(result.correct).toBeLessThan(result.total)
    expect(result.passed).toBe(result.percent >= EXAM_PASS_PERCENT)
    expect(result.honor).toBe(examHonor(result.percent))
  })

  it('accepts a short no on the later-yeush question', () => {
    const answers = examQuestions().map(() => '')
    const later = examQuestions().findIndex((question) => question.id === 'exam-21b-later')
    answers[later] = 'No, it came to him in issur'
    const result = gradeExam(answers, 'Hillel')
    expect(result.items[later]?.correct).toBe(true)
  })
})

describe('exam helpers', () => {
  it('counts filled answers and prints a packet', () => {
    expect(answeredCount(['', '  hi  ', ''])).toBe(1)
    expect(examHonor(92)).toBe('Solid in the sugya')
    expect(examHonor(70)).toBe('Knows the pshat')
    expect(examHonor(40)).toBe('Needs another sitting')
    const html = examPacketHtml()
    expect(html).toMatch(/Test Week/)
    expect(html).toMatch(/threshing floor|scattered fruit/i)
    expect(html).toMatch(/אלו מציאות/)
  })
})
