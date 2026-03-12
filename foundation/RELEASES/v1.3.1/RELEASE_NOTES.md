# Release Notes — v1.3.1

**Released:** March 2025  
**Tag:** `foundation-v1.3.1`  
**Status:** Superseded by v1.3.2  
**Branch:** `foundation`

---

## Summary

TanStack blank page fixed. Next.js upgraded from a 4-file stub to a full dashboard (complete source tree ported from Vite). Both Next.js router variants added to CLI. Shadcn option added for TanStack. First version with comprehensive docs suite and GitHub Actions workflows.

---

## What changed

### Added
- Next.js full dashboard — complete source (store, features, layouts, pages, i18n) ported from Vite template. Was previously a 4-file stub.
- Both Next.js router variants (App Router and Pages Router) in CLI.
- PWA option for Next.js (was missing from capability matrix).
- Shadcn + Tailwind styling option for TanStack.
- `ARCHITECTURE.md` — deep technical reference for contributors and AI agents.
- Full docs suite: `docs/getting-started.md`, `docs/capability-matrix.md`, `docs/stable-combinations.md`, `docs/roadmap.md`, `docs/versions.md`, `docs/architecture.md`.
- GitHub infrastructure: issue templates, PR template, validate + release workflows.
- `llms.txt` — machine-readable project summary for AI/LLM discovery.
- `RELEASES/` directory and release notes system.

### Fixed
- **TanStack blank page** — `src/routes/index.tsx` was a full duplicate of `__root.tsx`. Fixed to `<Navigate to="/home" replace />`.
- **Next.js `@mui/material-nextjs` error** — Removed dependency on `AppRouterCacheProvider`, replaced with direct `ThemeProvider`.
- `'use client'` directives added to all Next.js layout and page components.
- `react-router-dom` imports replaced with `next/navigation` in Next.js template (import lines only — call sites had a residual bug fixed in v1.3.2).

### Known issues (fixed in v1.3.2)
- `useNavigate is not defined` crash in Next.js — import lines patched but call sites missed.
- Next.js 15 SWC binary truncation on macOS Catalina.

---

## Checkpoint significance

This is recommended as a **key version to archive** — it marks the point where Vite, TanStack, and Next.js all offer full dashboards for the first time. The honest capability matrix and full docs suite also make this the first version suitable for public use.
