/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

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
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.js"],
    alias: {
      "@react-oauth/google": path.resolve("./src/tests/mocks/react-oauth-google.js"),
      "@react-pdf/renderer": path.resolve("./src/tests/mocks/react-pdf-renderer.jsx")
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/App.jsx",
        "src/main.jsx",
        "src/tests/**",
        "src/**/*.test.{js,jsx}",
        "src/**/*.stories.{js,jsx}",
        "src/styles/**",
        "src/assets/**",
        "src/**/styles.js",
        "src/docs/**",
        "src/components/IntroAnimation/**",
        "src/components/ContratoRVR/**",
        "src/services/auth.js",
        "src/services/api.js",
        "src/components/index.js",
        "src/pages/index.js",
      ],
      thresholds: {
        branches: 75,
        functions: 85,
        lines: 85
      }
    },
  }
});
