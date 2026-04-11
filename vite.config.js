import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    alias: {
      '@react-oauth/google': path.resolve('./src/tests/mocks/react-oauth-google.js'),
      '@react-pdf/renderer': path.resolve('./src/tests/mocks/react-pdf-renderer.jsx'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/tests/**',
        'src/**/*.test.{js,jsx}',
        'src/styles/**',
        'src/assets/**',
        'src/**/styles.js',
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
