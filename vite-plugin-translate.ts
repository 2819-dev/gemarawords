import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'
import { translateWords } from './src/lib/lookup.ts'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'))
    })
    req.on('error', reject)
  })
}

export function translateApiPlugin(): Plugin {
  return {
    name: 'translate-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/api/translate' || req.method !== 'POST') {
          next()
          return
        }

        void (async () => {
          try {
            const raw = await readBody(req)
            const payload = JSON.parse(raw || '{}') as { words?: unknown }
            const words = Array.isArray(payload.words)
              ? payload.words.filter((word): word is string => typeof word === 'string')
              : []
            const results = await translateWords(words)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ results }))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: error instanceof Error ? error.message : 'Lookup failed',
              }),
            )
          }
        })()
      })
    },
  }
}
