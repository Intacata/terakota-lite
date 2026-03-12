# Stable Combinations

This document lists every scaffold combination that has been tested end-to-end, along with test status, known issues, and notes. Use this as a reference before selecting your stack.

**Test definition:** A combination is marked ✅ Stable when a generated project satisfies all items in the [Testing Checklist](../CONTRIBUTING.md#testing-checklist) — install succeeds, dev server starts, browser renders without errors, all navigation and interactive features work.

---

## Tier 1 — Confirmed Stable

These combinations have been fully tested and confirmed working.

| # | Framework | Platform | Styling | Layout | Status | Version confirmed |
|---|---|---|---|---|---|---|
| 1 | **Vite** | Web + PWA | MUI 7 + Tailwind | sidebar-vertical-right | ✅ Stable | v1.2.4+ |
| 2 | **Vite** | Web + PWA | MUI 7 | sidebar-vertical | ✅ Stable | v1.2.4+ |
| 3 | **Vite** | Web Only | MUI 7 + Tailwind | minimal | ✅ Stable | v1.2.4+ |

---

## Tier 2 — Recently Added, Testing Ongoing

These combinations are expected to work based on the fixes applied and the architecture, but have not yet had full end-to-end user confirmation for every variant.

| # | Framework | Platform | Styling | Layout | Status | Notes |
|---|---|---|---|---|---|---|
| 4 | **TanStack** | Web + PWA | MUI 6 + Tailwind | sidebar-vertical | 🔶 Beta | Blank page fix in v1.3.1 |
| 5 | **TanStack** | Web Only | MUI 6 | sidebar-vertical | 🔶 Beta | Same fix |
| 6 | **TanStack** | Web Only | Shadcn + MUI 6 | sidebar-vertical | 🔶 Beta | Shadcn added in v1.3.1 |
| 7 | **Next.js App Router** | Web Only | MUI 7 + Tailwind | sidebar-vertical | 🔶 Beta | Full dashboard ported in v1.3.1 |
| 8 | **Next.js App Router** | Web + PWA | MUI 7 + Tailwind | sidebar-vertical | 🔶 Beta | PWA added in v1.3.1 |
| 9 | **CRA** | Web Only | MUI 7 + Tailwind | sidebar-vertical | 🔶 Beta | Based on shared source |
| 10 | **CRA** | Web Only | MUI 7 | sidebar-vertical | 🔶 Beta | Based on shared source |

---

## Tier 3 — Basic Starters

These are scaffold starters, not full dashboards. They generate a minimal working project as a starting point.

| # | Framework | Platform | Styling | Status | Notes |
|---|---|---|---|---|---|
| 11 | **Astro** | Web Only | Tailwind | 🔷 Starter | Basic Astro starter template |

---

## Not Yet Tested

| Framework | Styling | Blocker / Notes |
|---|---|---|
| Vite | Shadcn + Tailwind | Styling option exists in CLI, full test pending |
| Vite | Shadcn only (no MUI) | Template source based on MUI; full port needed |
| Vite | Bootstrap 5 + MUI 7 | Deps added, full visual test pending |
| Vite | CSS Modules | Deps minimal, full test pending |
| Vite | Tailwind Only | Template strips MUI, full test pending |
| Vite | Web + PWA + Electron | Electron integration test pending |
| Vite | Electron Only | As above |
| TanStack | MUI 6 only (no Tailwind) | As above |
| Next.js Pages Router | Any | Uses App Router source; full Pages Router port planned for v1.4 |
| Next.js App Router | MUI 7 only | Test pending |

---

## Compatibility Notes by Operating System

### macOS 10.15 Catalina
All stable combinations are confirmed to work on Catalina. Several package versions are intentionally pinned for Catalina compatibility — see [ARCHITECTURE.md](../ARCHITECTURE.md) for the full rationale.

### macOS 12+ Monterey and above
No additional constraints. All combinations work.

### Windows 10 / 11
Expected to work for all combinations. PowerShell or Git Bash recommended. `shell: true` is set in the auto-install execa call for compatibility.

### Ubuntu 20.04 / 22.04
Expected to work for all combinations. Ensure Node.js 18+ is installed via nvm or nodesource.

---

## Feature Combinations That Are Always Safe

These feature selections work for every full-dashboard framework:

| Feature | Always available |
|---|---|
| i18n / RTL | ✅ |
| Widget system | ✅ |
| Auth pages | ✅ |
| Dark / Light / System theme | ✅ |
| Toast notifications | ✅ |

These features are framework-specific and only shown where supported:

| Feature | Available for |
|---|---|
| PWA Context + install prompt | Vite, TanStack, Next.js |
| Storybook | Vite, CRA |
| Guided tour (react-joyride) | Vite, CRA |
| Electron build | Vite only |

---

## How to Report a Broken Combination

If a combination you selected doesn't work, please [open an issue](https://github.com/intacata-org/terakota-lite/issues/new?template=bug_report.md) with:

1. Exact CLI selections (framework, platform, styling, layout, features)
2. Node.js and npm versions
3. Operating system and version
4. Full terminal output from `npm install` and `npm run dev`
5. Browser console errors (if any)

This helps us update this table and prioritise fixes.
