type SenseNode = {
  definition?: unknown
  senses?: unknown
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  return value as Record<string, unknown>
}

function collectDefinitions(node: unknown, found: string[] = []): string[] {
  if (!node) {
    return found
  }
  if (typeof node === 'string') {
    if (node.trim()) {
      found.push(node)
    }
    return found
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      collectDefinitions(item, found)
    }
    return found
  }
  const record = asRecord(node)
  if (!record) {
    return found
  }
  if (typeof record.definition === 'string' && record.definition.trim()) {
    found.push(record.definition)
  }
  collectDefinitions(record.senses, found)
  return found
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractItalics(html: string): string[] {
  return [...html.matchAll(/<i>(.*?)<\/i>/gi)]
    .map((match) => stripTags(match[1] ?? ''))
    .filter((text) => text.length > 3 && !/^(pa|af|ithpa|ithpe|aphel)\.?$/i.test(text))
}

function tidyGloss(text: string): string {
  let gloss = text.replace(/\s+/g, ' ').trim().replace(/^[,;:\s]+/, '')
  if (gloss.length > 180) {
    const cut = gloss.slice(0, 180)
    const lastSpace = cut.lastIndexOf(' ')
    gloss = `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`
  }
  return gloss
}

function isUsefulGloss(text: string): boolean {
  const lower = text.toLowerCase()
  if (text.length < 2) {
    return false
  }
  if (/^v\.\s/i.test(text) || lower.startsWith('see ') || lower === 'next w.') {
    return false
  }
  return /[a-zA-Z]/.test(text)
}

export function glossFromDefinition(definition: string): string {
  const italics = extractItalics(definition)
  if (italics.length > 0) {
    return tidyGloss(italics[0] ?? '')
  }
  return tidyGloss(stripTags(definition))
}

function glossFromEntry(entry: unknown): string {
  const record = asRecord(entry)
  if (!record) {
    return ''
  }
  return (
    collectDefinitions(record.content as SenseNode)
      .map(glossFromDefinition)
      .find(isUsefulGloss) ?? ''
  )
}

export function pickGloss(entries: unknown): string {
  if (!Array.isArray(entries) || entries.length === 0) {
    return ''
  }

  for (const entry of entries) {
    const gloss = glossFromEntry(entry)
    if (gloss) {
      return gloss
    }
  }

  return ''
}
