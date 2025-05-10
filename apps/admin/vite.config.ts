import path from "node:path"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "seyedalireza",
      project: "gold",
      url: "https://sentry.hamravesh.com/",
    }),
  ],

  server: {
    port: 7327,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    sourcemap: true,
  },
})
