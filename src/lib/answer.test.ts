import { describe, expect, it } from 'vitest'
import { checkAnswer, questionFor } from './answer.ts'
import type { Card } from './types.ts'

function card(partial: Partial<Card> & Pick<Card, 'hebrew' | 'translation'>): Card {
  return {
    id: 'test',
    kind: 'word',
    weight: 1,
    consecutiveCorrect: 0,
    source: 'manual',
    ...partial,
  }
}

describe('questionFor', () => {
  it('asks what a word means', () => {
    expect(questionFor(card({ hebrew: 'הָוֵי', translation: 'is' }))).toBe(
      'What does this word mean?',
    )
  })

  it('asks what a sentence means', () => {
    expect(
      questionFor(card({ kind: 'sentence', hebrew: 'תָּא שְׁמַע', translation: 'come and hear' })),
    ).toBe('What does this mean?')
  })

  it('uses the written prompt for questions', () => {
    expect(
      questionFor(
        card({
          kind: 'question',
          hebrew: 'סִימָן',
          prompt: 'What is a siman?',
          translation: 'An identifying mark',
        }),
      ),
    ).toBe('What is a siman?')
  })
})

describe('checkAnswer', () => {
  it('accepts the same words ignoring case and punctuation', () => {
    const result = checkAnswer(
      card({ hebrew: 'תָּא שְׁמַע', translation: 'Come and hear!' }),
      'come and hear',
    )
    expect(result.correct).toBe(true)
  })

  it('accepts a phrase that appears in the official answer', () => {
    const result = checkAnswer(
      card({
        hebrew: 'תָּא שְׁמַע',
        translation: 'Come and hear — the Gemara brings a proof from a mishna or baraita.',
        keywords: ['come and hear'],
      }),
      'come and hear',
    )
    expect(result.correct).toBe(true)
  })

  it('accepts yes or no when that is the start of the answer', () => {
    const q = card({
      kind: 'question',
      hebrew: 'סִימָן',
      prompt: 'Do they argue about an item with a siman?',
      translation: 'No. Everyone agrees it is not ye’ush.',
    })
    expect(checkAnswer(q, 'no').correct).toBe(true)
    expect(checkAnswer(q, 'yes').correct).toBe(false)
  })

  it('accepts a matching keyword', () => {
    const result = checkAnswer(
      card({
        hebrew: 'הָוֵי',
        translation: 'Aramaic: is / was / would be. From הוי, to be.',
        keywords: ['is', 'was', 'would be', 'to be'],
      }),
      'is',
    )
    expect(result.correct).toBe(true)
  })

  it('rejects an empty answer', () => {
    expect(checkAnswer(card({ hebrew: 'לֵית', translation: 'there is not' }), '   ').correct).toBe(
      false,
    )
  })

  it('rejects just repeating the Hebrew on the card', () => {
    expect(
      checkAnswer(card({ hebrew: 'לֵית', translation: 'there is not' }), 'לֵית').correct,
    ).toBe(false)
  })

  it('treats ye’ush and yeush as the same', () => {
    const result = checkAnswer(
      card({
        hebrew: 'יֵאוּשׁ',
        translation: 'Despair of recovering a lost object.',
        keywords: ['despair', 'yeush'],
      }),
      'ye’ush',
    )
    expect(result.correct).toBe(true)
  })

  it('accepts overlapping meaning on a longer answer', () => {
    const result = checkAnswer(
      card({
        kind: 'question',
        hebrew: 'יֵאוּשׁ שֶׁלֹּא מִדַּעַת',
        prompt: 'What does ye’ush shelo mida’as mean?',
        translation:
          'Despair that is not conscious: the owner does not know he lost the object yet.',
        keywords: ['despair', 'not know', 'unconscious'],
      }),
      'the owner does not know he lost it',
    )
    expect(result.correct).toBe(true)
  })

  it('rejects an unrelated guess', () => {
    const result = checkAnswer(
      card({ hebrew: 'הָכָא', translation: 'Aramaic: here.', keywords: ['here'] }),
      'tomorrow',
    )
    expect(result.correct).toBe(false)
  })
})
