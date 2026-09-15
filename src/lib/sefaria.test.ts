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
  it('uses the first useful lexicon entry in API order', () => {
    const gloss = pickGloss([
      {
        parent_lexicon: 'Klein Dictionary',
        content: { senses: [{ definition: 'to say.' }] },
      },
      {
        parent_lexicon: 'Jastrow Dictionary',
        content: {
          senses: [
            {
              definition:
                '<i>to join, knot; to be knotted, thick;</i> b) <i>to heap up;</i>',
            },
          ],
        },
      },
    ])
    expect(gloss).toBe('to say.')
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
