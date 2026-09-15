import type { Handler } from '@netlify/functions'
import { translateWords } from '../../src/lib/lookup'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'POST required' }),
    }
  }

  let words: string[] = []
  try {
    const payload = JSON.parse(event.body || '{}') as { words?: unknown }
    words = Array.isArray(payload.words)
      ? payload.words.filter((word): word is string => typeof word === 'string')
      : []
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    }
  }

  try {
    const results = await translateWords(words)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Lookup failed',
      }),
    }
  }
}
