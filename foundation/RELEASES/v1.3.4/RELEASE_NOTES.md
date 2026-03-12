# Release Notes — v1.3.4

**Released:** March 2025  
**Tag:** `foundation-v1.3.4`  
**Status:** ✅ Latest stable

## Summary

Three Next.js template fixes that prevented the app from starting. No changes to Vite or TanStack templates.

## Fixed

- **`next.config.ts` error on startup** — Next.js 14 does not support `.ts` config files (introduced in Next.js 15). Renamed to `next.config.js` with `/** @type */` JSDoc annotation for type safety.
- **i18n not initialised** — In Vite the i18n module is imported in `main.tsx`. Next.js App Router has no equivalent entry point. Added the import to `providers.tsx` (a `'use client'` component), wrapped in `@if:i18n` so it's omitted when i18n is not selected.
- **Missing `'use client'`** on `Landing.tsx` and `faviconUtils.ts` — both use React hooks and must be client components in Next.js App Router.

## No changes to
- Vite template (still stable)
- TanStack template
- CLI prompts or capability matrix
