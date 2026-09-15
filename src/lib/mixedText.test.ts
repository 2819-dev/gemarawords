import { describe, expect, it } from 'vitest'
import { embedHebrewPhrase, groupMixedParts, promptIncludesLemma, splitMixedText } from './mixedText.ts'

describe('splitMixedText', () => {
  it('keeps Hebrew runs together inside an English question', () => {
    const parts = splitMixedText('What does יֵאוּשׁ שֶׁלֹּא מִדַּעַת mean?')
    const hebrew = parts.filter((part) => part.hebrew).map((part) => part.text)
    expect(hebrew).toEqual(['יֵאוּשׁ', 'שֶׁלֹּא', 'מִדַּעַת'])
    expect(parts.some((part) => !part.hebrew && part.text.includes('What does'))).toBe(true)
    expect(parts.some((part) => !part.hebrew && part.text.includes('mean?'))).toBe(true)
  })
})

describe('groupMixedParts', () => {
  it('keeps Gemara word order in an English question', () => {
    const groups = groupMixedParts('What does יֵאוּשׁ שֶׁלֹּא מִדַּעַת mean?')
    const phrase = groups.find((group) => group.hebrew)
    expect(phrase?.hebrew && phrase.words).toEqual(['יֵאוּשׁ', 'שֶׁלֹּא', 'מִדַּעַת'])
  })

  it('does not reverse דבר שיש בו סימן', () => {
    const groups = groupMixedParts('Is there a מחלוקת by a דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן?')
    const phrases = groups.filter((group) => group.hebrew)
    expect(phrases[0]?.hebrew && phrases[0].words).toEqual(['מחלוקת'])
    expect(phrases[1]?.hebrew && phrases[1].words).toEqual([
      'דָּבָר',
      'שֶׁיֵּשׁ',
      'בּוֹ',
      'סִימָן',
    ])
  })
})

describe('embedHebrewPhrase', () => {
  it('puts Gemara words in source order in the string', () => {
    const embedded = embedHebrewPhrase(['דָּבָר', 'שֶׁאֵין', 'בּוֹ', 'סִימָן'])
    expect(embedded.indexOf('דָּבָר')).toBeLessThan(embedded.indexOf('שֶׁאֵין'))
    expect(embedded.indexOf('שֶׁאֵין')).toBeLessThan(embedded.indexOf('בּוֹ'))
    expect(embedded.indexOf('בּוֹ')).toBeLessThan(embedded.indexOf('סִימָן'))
  })
})

describe('promptIncludesLemma', () => {
  it('treats nikkud differences as the same word', () => {
    expect(promptIncludesLemma('What does יאוש mean?', 'יֵאוּשׁ')).toBe(true)
  })
})
