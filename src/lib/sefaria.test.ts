import { describe, expect, it } from 'vitest'
import { glossFromDefinition, pickGloss } from './sefaria.ts'

describe('glossFromDefinition', () => {
  it('pulls the first English italic from Jastrow', () => {
    expect(glossFromDefinition('<i>to say</i>, <i>speak</i>.')).toBe('to say')
  })

  it('strips tags from plain Klein glosses', () => {
    expect(glossFromDefinition('to say.')).toBe('to say.')
  })
})

describe('pickGloss', () => {
  it('prefers Talmudic Jastrow over modern Klein', () => {
    const gloss = pickGloss([
      {
        parent_lexicon: 'Klein Dictionary',
        parent_lexicon_details: { language: 'heb.modern' },
        content: { senses: [{ definition: 'to spell a word.' }] },
      },
      {
        parent_lexicon: 'Jastrow Dictionary',
        parent_lexicon_details: { language: 'heb.talmudic' },
        content: { senses: [{ definition: '<i>there is, are</i>.' }] },
      },
    ])
    expect(gloss).toBe('there is, are')
  })

  it('skips morphology and woe, then takes “to be”', () => {
    const gloss = pickGloss([
      {
        parent_lexicon: 'Jastrow Dictionary',
        parent_lexicon_details: { language: 'heb.talmudic' },
        content: {
          senses: [
            { definition: 'fut. יֶהֱוֵי ch.' },
            { definition: '(b. h.) woe!, ah!' },
            { definition: '<i>to exist; to be, become</i>.' },
          ],
        },
      },
    ])
    expect(gloss).toBe('to exist; to be, become')
  })

  it('skips cross-reference-only Jastrow entries', () => {
    const gloss = pickGloss([
      {
        parent_lexicon: 'Jastrow Dictionary',
        parent_lexicon_details: { language: 'heb.talmudic' },
        content: { senses: [{ definition: 'v. next w.' }] },
      },
      {
        parent_lexicon: 'Klein Dictionary',
        parent_lexicon_details: { language: 'heb.modern' },
        content: { senses: [{ definition: '‘we have learned’' }] },
      },
    ])
    expect(gloss).toBe('‘we have learned’')
  })

  it('returns empty string when there are no entries', () => {
    expect(pickGloss([])).toBe('')
  })
})
