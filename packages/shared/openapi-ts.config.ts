import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "assets/swagger.json",
  output: {
    format: "biome",
    lint: "biome",
    path: "src/client",
  },
  plugins: [...defaultPlugins, "@hey-api/client-fetch", { name: "@hey-api/sdk", asClass: true }],
})
