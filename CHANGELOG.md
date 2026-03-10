# Changelog

All notable changes to Terakota Foundation are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- CLI back-navigation between prompt steps
- TanStack + Shadcn-only layout variant
- Next.js Pages Router full port
- Zustand state manager swap files

---

## [1.3.2] — 2025-03

### Fixed
- **`useNavigate is not defined` crash in Next.js** — The v1.3.1 patch replaced only import lines. Call sites in `Sidebar/index.tsx`, `HorizontalLayout.tsx`, and `MinimalLayout.tsx` still called `useNavigate()` and `useLocation()` directly. All now correctly use `useRouter()` and `usePathname()` from `next/navigation`.
- **Broken `'next/navigation'// router` import strings** — Leftover artefact from partial v1.3.1 patch. Cleaned up in all auth pages.
- **Next.js 15 SWC binary crash on macOS 10.15 Catalina** — `@next/swc-darwin-x64` in Next.js 15 is a macOS 12+ binary (truncated mach-o error). Pinned Next.js to `^14.2.0` which ships Catalina-compatible binaries and falls back to WASM automatically.
- **`next.config.ts`** — Added `transpilePackages` for all MUI packages (required for SSR + MUI).
- **`tsconfig.json`** — Set `target: "ES2017"` to prevent Next.js auto-reconfiguration warning.

### Changed
- Next.js version: `^15.0.0` → `^14.2.0`
- `@types/node`: `^22` → `^20`

---

## [1.3.1] — 2025-Q1

### Added
- **Next.js full dashboard** — ported complete source (store, features, layouts, pages, i18n) from Vite template into `foundation-next-app`. Was previously a 4-file stub.
- **Both Next.js router variants** — App Router and Pages Router now appear as separate CLI options.
- **PWA option for Next.js** — added to capability matrix and scaffold.
- **Shadcn + Tailwind for TanStack** — added as a styling option on top of the MUI 6 base.
- **`ARCHITECTURE.md`** — deep technical reference for contributors and AI agents.
- `'use client'` directives automatically applied to all Next.js layout/page components.
- Proper `next/navigation` imports replace `react-router-dom` throughout Next.js template.
- Next.js store uses `process.env.NODE_ENV` instead of `import.meta.env.DEV`.

### Fixed
- **TanStack blank page** — `src/routes/index.tsx` was a full duplicate of `__root.tsx` (two root route definitions conflicting). Fixed to a simple `<Navigate to="/home" replace />`.
- **Next.js `@mui/material-nextjs` error** — replaced `AppRouterCacheProvider` approach with direct `ThemeProvider`, eliminating the missing package error.
- Next.js `providers.tsx` no longer requires `@mui/material-nextjs` package.
- CLI capability matrix: Next.js was incorrectly showing "Web only" — PWA added.

### Changed
- Next.js dev server runs on port 3009 (consistent with other templates).
- `next-pages` framework option scaffolds from `foundation-next-app` source with adapter label.

---

## [1.3.0] — 2025-Q1

### Added
- **Capability matrix** in CLI (`CAPABILITIES` object in `src/index.ts`) — defines per-framework supported options. CLI only renders choices that are real.
- Framework labels in CLI updated to clearly state "Full dashboard" vs "Basic starter".
- Next.js and Astro templates labelled as basic starters with "coming soon" notice.

### Changed
- **State manager prompt removed** — all full-dashboard templates are Redux-based. CLI now states this clearly rather than offering Zustand/Jotai that would silently do nothing.
- TanStack framework description updated: "MUI 6 + Redux (fixed stack)".
- Astro template hidden from full-feature options.

### Fixed
- Vite template: removed `overrides.esbuild` (was incorrectly applied from TanStack fix in v1.2.7, breaking MUI 7).
- TanStack template: Redux and i18n deps now always included regardless of CLI selections (template source uses both unconditionally).

---

## [1.2.8] — 2025-Q1

### Fixed
- Redux and i18n deps missing when Zustand was selected for TanStack — scaffold now always includes them for TanStack regardless of CLI state manager selection.

---

## [1.2.7] — 2025-Q1

### Fixed
- **MUI 7 + esbuild 0.18 incompatibility** — MUI 7 ESM subpath imports (e.g. `../utils/memoTheme.js`) require esbuild 0.19+. Solution: TanStack uses MUI 6 (`^6.4.0`). Vite/CRA/Next use MUI 7 (Vite 4's internal bundling handles this without explicit esbuild override).
- esbuild `overrides` now only applied to TanStack projects (was incorrectly applied to all).
- React version pinned to `^18.3.0` for TanStack and CRA (React 19 compatibility issue with MUI 6).

---

## [1.2.6] — 2025-Q1

### Fixed
- MUI deps missing entirely when Shadcn styling selected for TanStack — added `alwaysMui` flag so TanStack and CRA always receive MUI deps.

---

## [1.2.5] — 2025-Q1

### Fixed
- TanStack build failure on macOS 10.15 Catalina — `@tanstack/router-vite-plugin@1.114+` pulls in esbuild 0.19+ which uses a macOS 12+ symbol (`_SecTrustCopyCertificateChain`).
- Added `"overrides": {"esbuild": "0.18.20"}` to TanStack generated `package.json`.
- Pinned `@tanstack/react-router` and `@tanstack/router-vite-plugin` to `^1.50.0`.

---

## [1.2.4] — 2025-Q1 — ✅ First confirmed stable Vite release

### Fixed
- **Template source corruption** — `str_replace` operations had introduced literal `\n` escape sequences into `Sidebar/index.tsx` (line 124) and `ThemeCustomizer.tsx` (line 120). Fixed via byte-exact Python replacement.
- Full scan of all `.tsx`/`.ts` files across all three templates confirmed clean.
- Comprehensive audit: no other literal escape corruption found.

### Added
- `.npmrc` with `legacy-peer-deps=true` written to every generated project.
- `--legacy-peer-deps` flag added to auto-install command.

### Status
- Vite PWA template (MUI 7 + Tailwind) confirmed working end-to-end by user ✅

---

## [1.2.3] — 2025-Q1

### Fixed
- `ReferenceError: Cannot access 'devDeps' before initialization` — Tailwind deps block had been placed at line 132, before `devDeps` was declared at line 176. Block moved to after declaration.

---

## [1.2.2] — 2025-Q1

### Fixed
- **npm install failures** (three causes):
  1. Explicit `esbuild: "0.18.20"` devDep alongside Vite 4.5 caused npm resolution conflict (Vite bundles its own esbuild internally).
  2. `tailwindcss`, `postcss`, `autoprefixer` were in `dependencies` instead of `devDependencies`.
  3. npm 11 strict peer-dep checking failed on React 19 + MUI 7 combinations.

---

## [1.2.1] — 2025-Q1

### Fixed
- **JSX comment syntax error** — `/*@if:widgets*/` blocks placed directly between `<Route>` JSX elements produced invalid TSX (bare `/* */` comment is not valid JSX). Removed conditional blocks from `routes/index.tsx` and `AppContainer.tsx`; widgets route is always included.

---

## [1.2.0] — 2025-Q1

### Added
- Dark mode persistence across sessions.
- RTL / LTR direction switching with full layout awareness.
- Sidebar push behaviour (content shifts instead of overlapping).
- Smooth sidebar width transitions (full ↔ mini ↔ closed).
- System theme mode (follows OS preference).
- `ThemeCustomizer` panel with runtime controls for all theme axes.
- Dynamic favicon adapts to dark/light theme.

---

## [1.1.0] — 2024

### Added
- Vite PWA template (`foundation-vite-tailwind`) with full working dashboard.
- Multi-framework CLI structure.
- TanStack Router template (initial).

---

## [1.0.0] — 2024

### Initial release
- CRA-derived base template.
- Basic CLI scaffold with framework selection.
- MUI 7 + Redux foundation.
