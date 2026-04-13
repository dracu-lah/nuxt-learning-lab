// `app.config.ts` is different from `nuxt.config.ts`:
//   - nuxt.config.ts → build-time config (modules, env, server presets)
//   - app.config.ts  → runtime config you can hot-reload from components
//
// Nuxt UI reads its primary/gray colors from here.
export default defineAppConfig({
  ui: {
    primary: 'emerald',
    gray: 'neutral'
  }
})
