import { describe, expect, it } from 'vitest'
import {
  entriesFromSheetRows,
  looksLikeHeader,
  parseCsv,
} from './spreadsheet.ts'

describe('looksLikeHeader', () => {
  it('skips English header rows', () => {
    expect(looksLikeHeader(['Word', 'Translation'])).toBe(true)
  })

  it('keeps a first row that already has Hebrew', () => {
    expect(looksLikeHeader(['אמר', 'to say'])).toBe(false)
  })
})

describe('entriesFromSheetRows', () => {
  it('reads one Hebrew word per row', () => {
    const entries = entriesFromSheetRows([['אמר'], ['רבי'], ['תנן']])
    expect(entries.map((entry) => entry.hebrew)).toEqual(['אמר', 'רבי', 'תנן'])
  })

  it('uses a translation column when present', () => {
    const entries = entriesFromSheetRows([
      ['Word', 'Translation'],
      ['אמר', 'to say'],
      ['רבי', 'Rabbi'],
    ])
    expect(entries).toEqual([
      { hebrew: 'אמר', translation: 'to say' },
      { hebrew: 'רבי', translation: 'Rabbi' },
    ])
  })

  it('splits a single cell of many words the same way paste does', () => {
    const entries = entriesFromSheetRows([['אמר רבי אמר']])
    expect(entries.map((entry) => entry.hebrew)).toEqual(['אמר', 'רבי', 'אמר'])
  })

  it('keeps a Hebrew phrase together when a translation is in the next column', () => {
    const entries = entriesFromSheetRows([['בית המקדש', 'the Temple']])
    expect(entries).toEqual([{ hebrew: 'בית המקדש', translation: 'the Temple' }])
  })
})

describe('parseCsv', () => {
  it('reads comma-separated rows and quoted commas', () => {
    const rows = parseCsv('אמר,to say\n"רבי","my teacher, my master"\n')
    expect(rows).toEqual([
      ['אמר', 'to say'],
      ['רבי', 'my teacher, my master'],
    ])
  })
})
