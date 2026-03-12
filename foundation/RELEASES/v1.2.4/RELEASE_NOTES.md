# Release Notes — v1.2.4

**Released:** 2025 Q1  
**Tag:** `foundation-v1.2.4`  
**Status:** Archived  
**Branch:** `foundation`

---

## Summary

First confirmed stable release. Vite PWA template (MUI 7 + Tailwind) confirmed working end-to-end. Fixed template source corruption introduced by str_replace tooling.

---

## What changed

### Fixed
- Template source corruption — `str_replace` operations had introduced literal `\n` escape sequences into `Sidebar/index.tsx` (line 124) and `ThemeCustomizer.tsx` (line 120).
- Full scan of all `.tsx`/`.ts` files across all three templates confirmed clean.

### Added
- `.npmrc` with `legacy-peer-deps=true` written to every generated project.
- `--legacy-peer-deps` flag added to auto-install command.

---

## Checkpoint significance

**Key archive version.** This is the last known-good state before TanStack work began introducing regressions. If you need the simplest, most tested baseline — Vite + MUI 7 + Tailwind — this is your reference point.

**What works in this version:**
- Vite + MUI 7 + Tailwind + all features — confirmed ✅

**What does not work (fixed in later versions):**
- TanStack — blank page
- Next.js — 4-file stub only, not a full dashboard
