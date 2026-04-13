// `app.config.ts` is different from `nuxt.config.ts`:
//   - nuxt.config.ts → build-time config (modules, env, server presets)
//   - app.config.ts  → runtime config you can hot-reload from components
//
// Nuxt UI v4 + Tailwind v4
// ------------------------
// In v2 you used to set `ui: { primary: 'emerald', gray: 'neutral' }` here
// to swap palettes. In v4, **theming moved out** — colors, radii, and fonts
// all live in `app/assets/css/main.css` inside the `@theme` and `:root`
// blocks. This file now only carries semantic aliases.
//
// `ui.colors.primary: 'red'` tells Nuxt UI which Tailwind palette name to
// expose as the semantic `primary` color. Nuxt UI then renders buttons,
// links, focus rings, etc. using `--color-red-*` from Tailwind v4. To
// override individual shades, override `--color-red-500` (or whichever)
// in main.css's `@theme` block.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      neutral: 'neutral'
    }
  }
})
