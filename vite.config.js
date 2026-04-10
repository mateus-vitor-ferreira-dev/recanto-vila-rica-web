import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    alias: {
      '@react-oauth/google': path.resolve('./src/tests/mocks/react-oauth-google.js'),
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
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
