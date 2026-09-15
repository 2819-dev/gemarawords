import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { translateApiPlugin } from './vite-plugin-translate.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), translateApiPlugin()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
