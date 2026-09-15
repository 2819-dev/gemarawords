import { describe, expect, it } from 'vitest'
import { promptIncludesLemma, splitMixedText } from './mixedText.ts'

describe('splitMixedText', () => {
  it('keeps Hebrew runs together inside an English question', () => {
    const parts = splitMixedText('What does יֵאוּשׁ שֶׁלֹּא מִדַּעַת mean?')
    const hebrew = parts.filter((part) => part.hebrew).map((part) => part.text)
    expect(hebrew).toEqual(['יֵאוּשׁ שֶׁלֹּא מִדַּעַת'])
    expect(parts.some((part) => !part.hebrew && part.text.includes('What does'))).toBe(true)
    expect(parts.some((part) => !part.hebrew && part.text.includes('mean?'))).toBe(true)
  })
})

describe('promptIncludesLemma', () => {
  it('treats nikkud differences as the same word', () => {
    expect(promptIncludesLemma('What does יאוש mean?', 'יֵאוּשׁ')).toBe(true)
  })
})
