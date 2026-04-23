/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    }
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/App.jsx", "src/main.jsx", "src/tests/**", "src/**/*.test.{js,jsx}", "src/styles/**", "src/assets/**", "src/**/styles.js", "src/components/IntroAnimation/**", "src/components/ContratoRVR/**", "src/services/auth.js",
      // excluir arquivos de baixo ROI para coverage
      "src/services/api.js", "src/components/index.js", "src/pages/index.js"],
      thresholds: {
        branches: 85,
        functions: 90,
        lines: 90
      }
    },
    projects: [{
      extends: true,
      test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/tests/setup.js"],
        alias: {
          "@react-oauth/google": path.resolve("./src/tests/mocks/react-oauth-google.js"),
          "@react-pdf/renderer": path.resolve("./src/tests/mocks/react-pdf-renderer.jsx")
        }
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});