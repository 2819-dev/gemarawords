import type { WordEntry } from './words.ts'
import { collectTokens, normalizeWord } from './words.ts'

const HEBREW = /[\u0590-\u05FF]/
const HEADER = /word|hebrew|translation|english|meaning|definition|term|gloss|מילה|תרגום/i

export function cellText(value: unknown): string {
  if (value == null) {
    return ''
  }
  if (typeof value === 'string') {
    return value.trim()
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  return String(value).trim()
}

export function looksLikeHeader(row: string[]): boolean {
  const cells = row.map((cell) => cell.trim()).filter(Boolean)
  if (cells.length === 0) {
    return false
  }
  if (cells.some((cell) => HEBREW.test(cell))) {
    return false
  }
  return cells.some((cell) => HEADER.test(cell)) || cells.every((cell) => !HEBREW.test(cell))
}

export function entriesFromSheetRows(rows: string[][]): WordEntry[] {
  const start = rows[0] && looksLikeHeader(rows[0]) ? 1 : 0
  const entries: WordEntry[] = []

  for (const row of rows.slice(start)) {
    const cells = row.map((cell) => cell.trim()).filter(Boolean)
    if (cells.length === 0) {
      continue
    }

    const hebrewCell = cells.find((cell) => HEBREW.test(cell)) ?? cells[0] ?? ''
    const translation = cells.find((cell) => cell !== hebrewCell && !HEBREW.test(cell))

    if (translation) {
      if (normalizeWord(hebrewCell)) {
        entries.push({ hebrew: hebrewCell.replace(/^[,.;:]+|[,.;:]+$/g, ''), translation })
      }
      continue
    }

    for (const token of collectTokens(hebrewCell)) {
      entries.push({ hebrew: token })
    }
  }

  return entries
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  const source = text.replace(/^\uFEFF/, '')

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (inQuotes) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === ',' || char === '\t') {
      row.push(field)
      field = ''
      continue
    }
    if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') {
        index += 1
      }
      row.push(field)
      field = ''
      if (row.some((cell) => cell.trim())) {
        rows.push(row)
      }
      row = []
      continue
    }
    field += char
  }

  row.push(field)
  if (row.some((cell) => cell.trim())) {
    rows.push(row)
  }
  return rows
}

function extensionOf(file: File): string {
  const name = file.name.toLowerCase()
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot)
}

export async function parseSpreadsheetFile(file: File): Promise<WordEntry[]> {
  const extension = extensionOf(file)
  if (extension === '.csv' || file.type === 'text/csv') {
    return entriesFromSheetRows(parseCsv(await file.text()))
  }
  if (extension === '.xls') {
    throw new Error('Save the file as .xlsx or .csv, then upload it again.')
  }
  if (extension && extension !== '.xlsx') {
    throw new Error('Use an Excel .xlsx file or a .csv file.')
  }

  const { readSheet } = await import('read-excel-file/browser')
  const data = await readSheet(file)
  const rows = data.map((row) => row.map((cell) => cellText(cell)))
  return entriesFromSheetRows(rows)
}
