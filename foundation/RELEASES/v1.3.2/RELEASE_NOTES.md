# Release Notes — v1.3.2

**Released:** March 2025  
**Tag:** `foundation-v1.3.2`  
**Status:** ✅ Latest stable  
**Branch:** `foundation`

---

## Summary

Fixes the Next.js template's runtime crash (`useNavigate is not defined`) caused by incomplete react-router-dom → next/navigation migration in v1.3.1. Also pins Next.js to 14.x for macOS 10.15 Catalina compatibility (Next.js 15 ships a native SWC binary built for macOS 12+).

---

## What changed

### Fixed
- **`useNavigate is not defined` crash in Next.js** — The v1.3.1 patch replaced import statements but left `useNavigate()` and `useLocation()` call sites intact in `Sidebar/index.tsx`, `HorizontalLayout.tsx`, and `MinimalLayout.tsx`. All call sites now correctly use `useRouter()` and `usePathname()` from `next/navigation`.
- **Broken import string `from 'next/navigation'// router`** — Leftover from previous partial patch. Cleaned up across all auth pages (Login, Registration, LockScreen, Landing).
- **Next.js 15 SWC binary truncation on macOS Catalina** — `@next/swc-darwin-x64` in Next.js 15 is a macOS 12+ binary (`truncated mach-o` error). Pinned Next.js to `^14.2.0` which ships Catalina-compatible SWC binaries. Next.js 14 also falls back to WASM automatically if the native binary fails.
- **`next.config.ts`** — Added `transpilePackages` for all MUI packages, which is required for correct SSR rendering with Next.js + MUI.
- **`tsconfig.json`** — Set `target: "ES2017"` to prevent Next.js from auto-reconfiguring it on first run (avoids the "We detected TypeScript in your project and reconfigured your tsconfig.json" warning).

### Changed
- Next.js version: `^15.0.0` → `^14.2.0`
- `@types/node` version: `^22` → `^20` (aligns with Next.js 14 peer deps)
- `next.config.ts` now includes `transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/system', '@mui/lab']`

---

## Stable combinations in this release

| Framework | Platform | Styling | Status |
|---|---|---|---|
| Vite | Web + PWA | MUI 7 + Tailwind | ✅ Confirmed stable |
| Vite | Web + PWA | MUI 7 | ✅ Confirmed stable |
| TanStack | Web + PWA | MUI 6 + Tailwind | 🔶 Beta (blank page fix in v1.3.1) |
| Next.js App Router | Web Only | MUI 7 + Tailwind | 🔶 Beta (router crash fixed this release) |
| Next.js App Router | Web + PWA | MUI 7 + Tailwind | 🔶 Beta |

---

## Install this version

```bash
# From GitHub Releases
unzip Terakota-Foundation-v1.3.2.zip -d Terakota-Foundation
cd Terakota-Foundation
node create.js MyApp

# From git tag
git checkout tags/foundation-v1.3.2
node create.js MyApp
```

---

## Known issues

- Next.js Pages Router scaffolds from the App Router source. True Pages Router port planned for v1.4.
- Vite Shadcn-only styling (without MUI) not yet tested end-to-end.
- Astro is a basic starter (not a full dashboard).
- CLI has no back-navigation between prompts — planned for v1.4.
