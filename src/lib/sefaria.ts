type SenseNode = {
  definition?: unknown
  senses?: unknown
}

const PREFERRED_LEXICONS = [
  'Jastrow Dictionary',
  'Jastrow Unabbreviated',
  'Klein Dictionary',
]

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
    .filter((text) => text.length > 1)
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
    return tidyGloss(italics.slice(0, 3).join(', '))
  }
  return tidyGloss(stripTags(definition))
}

export function pickGloss(entries: unknown): string {
  if (!Array.isArray(entries) || entries.length === 0) {
    return ''
  }

  const scored = entries
    .map((entry) => {
      const record = asRecord(entry)
      if (!record) {
        return null
      }
      const lexicon =
        typeof record.parent_lexicon === 'string' ? record.parent_lexicon : ''
      const definitions = collectDefinitions(record.content as SenseNode)
      const glosses = definitions
        .map(glossFromDefinition)
        .filter(isUsefulGloss)
      return {
        lexicon,
        gloss: glosses[0] ?? '',
        preferredIndex: PREFERRED_LEXICONS.findIndex(
          (name) => lexicon === name || lexicon.startsWith(name),
        ),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.gloss))

  scored.sort((a, b) => {
    const aPref = a.preferredIndex === -1 ? 99 : a.preferredIndex
    const bPref = b.preferredIndex === -1 ? 99 : b.preferredIndex
    return aPref - bPref
  })

  return scored[0]?.gloss ?? ''
}
