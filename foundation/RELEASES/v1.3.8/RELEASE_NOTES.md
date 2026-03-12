# Release Notes — v1.3.8

**Released:** March 2025  
**Tag:** `foundation-v1.3.8`  
**Status:** ✅ Latest stable

## Summary

Fixes the `Cannot find package '@emotion/babel-plugin'` startup crash in the Vite PWA template. The crash happened on first `npm run dev` / `yarn dev` after scaffolding a new app.

## Root cause

`vite.config.ts` in both `foundation-vite` and `foundation-vite-tailwind` listed `@emotion/babel-plugin` inside the `react()` plugin's `babel.plugins` array. When Vite starts, its React plugin's bundled Babel resolver performs an ESM import-meta-resolve lookup for every listed plugin before touching any source file. Because `@emotion/babel-plugin` is not installed (it was never added to `package.template.json` or generated `package.json`), that resolve throws `ERR_PACKAGE_NOT_FOUND` — crashing the dev server before it can compile a single file.

```
Internal server error: Cannot find package '@emotion/babel-plugin'
imported from .../babel-virtual-resolve-base.js
```

## Fix

Removed the `babel: { plugins: ['@emotion/babel-plugin'] }` block from the `react()` call in both templates.

| File changed | Change |
|---|---|
| `packages/templates/foundation-vite/vite.config.ts` | Removed `babel.plugins` block |
| `packages/templates/foundation-vite-tailwind/vite.config.ts` | Removed `babel.plugins` block |

`jsxImportSource: '@emotion/react'` is left intact — this is the correct and sufficient way to wire Emotion into Vite's React plugin for MUI compatibility. The `@emotion/babel-plugin` is an *optional* Emotion enhancement (adds auto-labelling of class names, shorthand `css` prop, and source maps). It requires explicit installation and is not needed for standard MUI usage.

## Affected templates

| Template | Affected? |
|---|---|
| `foundation-vite` | ✅ Fixed |
| `foundation-vite-tailwind` | ✅ Fixed |
| `foundation-next-app` | ✗ Not affected (no vite.config) |
| `foundation-cra` | ✗ Not affected (no vite.config) |
| `foundation-astro` | ✗ Not affected (no vite.config) |

## For existing installs

If you already scaffolded a Vite app from v1.3.7 or earlier and are hitting this error, update your app's `vite.config.ts`:

**Remove** this block inside `react({...})`:
```ts
babel: {
    plugins: ['@emotion/babel-plugin'],
},
```

The `react()` call should look like this after the fix:
```ts
react({
    jsxImportSource: '@emotion/react',
}),
```

No `npm install` or package changes needed — this is a config-only fix.
