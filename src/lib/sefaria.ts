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
    .filter((text) => text.length > 3 && !/^(pa|af|ithpa|ithpe|aphel|pe|nif)\.?$/i.test(text))
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

function isMorphologyOnly(text: string): boolean {
  return /^(fut\.|,?\s*fut\.|part\.|perf\.|imperat\.|inf\.|contr\.|denom\.|pl\.|f\.|m\.)/i.test(
    text,
  )
}

function isCrossRef(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    /^v\.\s/i.test(text) ||
    lower.startsWith('see ') ||
    lower === 'next w.' ||
    /^same\b/i.test(text)
  )
}

function isInterjection(text: string): boolean {
  const plain = text.replace(/^\([^)]*\)\s*/g, '').trim()
  return /^(woe|ah!|alas|ha!|ho!)/i.test(plain)
}

function isUsefulGloss(text: string): boolean {
  if (text.length < 2 || !/[a-zA-Z]/.test(text)) {
    return false
  }
  return !isMorphologyOnly(text) && !isCrossRef(text) && !isInterjection(text)
}

export function glossFromDefinition(definition: string): string {
  const italics = extractItalics(definition)
  if (italics.length > 0) {
    return tidyGloss(italics[0] ?? '')
  }
  return tidyGloss(stripTags(definition))
}

function lexiconRank(entry: Record<string, unknown>): number {
  const name = typeof entry.parent_lexicon === 'string' ? entry.parent_lexicon : ''
  const details = asRecord(entry.parent_lexicon_details)
  const language = typeof details?.language === 'string' ? details.language : ''
  if (name.includes('Jastrow') && language.includes('talmudic')) {
    return 0
  }
  if (name.includes('Jastrow')) {
    return 1
  }
  if (name.includes('Klein')) {
    return 2
  }
  return 9
}

function glossesFromEntry(entry: unknown): string[] {
  const record = asRecord(entry)
  if (!record) {
    return []
  }
  return collectDefinitions(record.content as SenseNode)
    .map(glossFromDefinition)
    .filter(isUsefulGloss)
}

function scoreGloss(gloss: string): number {
  let score = 0
  if (/^to [a-z]/i.test(gloss)) {
    score += 8
  }
  if ((gloss.match(/;/g) ?? []).length >= 3) {
    score -= 6
  }
  return score
}

export function pickGloss(entries: unknown): string {
  if (!Array.isArray(entries) || entries.length === 0) {
    return ''
  }

  const ranked = entries
    .map((entry) => {
      const record = asRecord(entry)
      if (!record) {
        return null
      }
      return {
        rank: lexiconRank(record),
        glosses: glossesFromEntry(record),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item && item.glosses.length > 0))
    .sort((a, b) => a.rank - b.rank)

  const jastrow = ranked.filter((item) => item.rank <= 1)
  const others = ranked.filter((item) => item.rank > 1)

  for (const group of [jastrow, others]) {
    let best = ''
    let bestScore = Number.NEGATIVE_INFINITY
    for (const item of group) {
      for (const gloss of item.glosses) {
        const score = scoreGloss(gloss) - item.rank
        if (score > bestScore) {
          best = gloss
          bestScore = score
        }
      }
    }
    if (best) {
      return best
    }
  }

  return ''
}
