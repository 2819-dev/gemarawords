import { describe, expect, it } from 'vitest'
import { glossFromDefinition, pickGloss } from './sefaria.ts'

describe('glossFromDefinition', () => {
  it('pulls English from Jastrow italics', () => {
    expect(glossFromDefinition('<i>to say</i>, <i>speak</i>.')).toBe('to say, speak')
  })

  it('strips tags from plain Klein glosses', () => {
    expect(glossFromDefinition('to say.')).toBe('to say.')
  })
})

describe('pickGloss', () => {
  it('prefers a Jastrow gloss over other lexicons', () => {
    const gloss = pickGloss([
      {
        parent_lexicon: 'Klein Dictionary',
        content: { senses: [{ definition: 'to say.' }] },
      },
      {
        parent_lexicon: 'Jastrow Dictionary',
        content: { senses: [{ definition: '<i>to repeat, do a second time</i>.' }] },
      },
    ])
    expect(gloss).toBe('to repeat, do a second time')
  })

  it('skips cross-reference-only Jastrow entries', () => {
    const gloss = pickGloss([
      {
        parent_lexicon: 'Jastrow Dictionary',
        content: { senses: [{ definition: 'v. next w.' }] },
      },
      {
        parent_lexicon: 'Klein Dictionary',
        content: { senses: [{ definition: '‘we have learned’' }] },
      },
    ])
    expect(gloss).toBe('‘we have learned’')
  })

  it('returns empty string when there are no entries', () => {
    expect(pickGloss([])).toBe('')
  })
})
