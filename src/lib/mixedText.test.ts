import { describe, expect, it } from 'vitest'
import { promptIncludesLemma, splitMixedText } from './mixedText.ts'

describe('splitMixedText', () => {
  it('keeps a Hebrew phrase together inside an English question', () => {
    const parts = splitMixedText('What does יֵאוּשׁ שֶׁלֹּא מִדַּעַת mean?')
    expect(parts.filter((part) => part.hebrew).map((part) => part.text)).toEqual([
      'יֵאוּשׁ שֶׁלֹּא מִדַּעַת',
    ])
    expect(parts.some((part) => !part.hebrew && part.text.includes('What does'))).toBe(true)
    expect(parts.some((part) => !part.hebrew && part.text.includes('mean?'))).toBe(true)
  })

  it('keeps each Hebrew phrase together when English sits between them', () => {
    const parts = splitMixedText('Is there a מחלוקת by a דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן?')
    expect(parts.filter((part) => part.hebrew).map((part) => part.text)).toEqual([
      'מחלוקת',
      'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    ])
  })
})

describe('promptIncludesLemma', () => {
  it('treats nikkud differences as the same word', () => {
    expect(promptIncludesLemma('What does יאוש mean?', 'יֵאוּשׁ')).toBe(true)
  })
})
