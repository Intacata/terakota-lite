# Roadmap

Foundation's development is staged around three goals: stability first, then breadth, then architectural elegance. This document outlines planned improvements, their priority, and the design thinking behind them.

---

## Current Status — v1.3.1

| Framework | Dashboard | Status |
|---|---|---|
| Vite + MUI 7 + Tailwind | Full | ✅ Stable |
| TanStack + MUI 6 | Full | 🔶 Beta |
| Next.js App Router + MUI 7 | Full | 🔶 Beta |
| CRA + MUI 7 | Full | 🔶 Beta |
| Astro | Basic starter | 🔷 Starter |

---

## v1.4 — CLI Polish & Template Completion

**Target: Q2 2025**

### CLI improvements
- **Back-navigation between prompts** — Currently the CLI cannot step back. This requires replacing the linear `prompts` library with a custom prompt-loop state machine that manages history.
- **Confirmation summary is editable** — Allow user to revise individual selections before confirming scaffold.

### Template fixes
- **Next.js Pages Router full port** — True Pages Router implementation with `_app.tsx`, `pages/` directory structure, and `getServerSideProps` patterns. Currently the Pages Router option scaffolds from the App Router source.
- **TanStack Shadcn-only layout** — Layout components that use only Tailwind + Shadcn/Radix, with no MUI dependency. This enables a clean headless stack for TanStack.

### New combinations
- **Vite + Shadcn-only** full dashboard (layout components ported from MUI to Shadcn)
- **Next.js + Shadcn** starter with App Router compatibility

---

## v1.5 — State Manager Flexibility

**Target: Q3 2025**

The single most requested feature. Currently all templates use Redux throughout. Moving to a flexible state manager requires a different approach than adding `zustand` as a dep and hoping for the best — the entire store, slices, and hook usage needs to change.

### Design approach

Rather than creating full template trees per state manager (which would be 3× the current template count), Foundation will introduce **per-axis swap files**:

```
packages/shared/
  state/
    redux/
      store.ts              ← configureStore
      themeSlice.ts         ← createSlice
      sidebarSlice.ts
    zustand/
      store.ts              ← create()
      themeStore.ts         ← zustand equivalent
      sidebarStore.ts
    jotai/
      atoms.ts              ← atom() definitions
```

The scaffold assembles the correct state layer based on the user's selection and adapts the layout component imports accordingly.

### Planned state managers
- **Zustand** (`^4.5`) — Lightweight, minimal boilerplate. All full-dashboard frameworks.
- **Jotai** (`^2.7`) — Atomic model. Vite and Next.js initially.
- **Context + useReducer** — Zero external deps. Vite initially.

---

## v1.6 — Astro Full Dashboard

**Target: Q3–Q4 2025**

Port the full dashboard to Astro's islands architecture. This is a genuinely different challenge from React-only frameworks:

- Dashboard shell becomes an Astro layout
- React interactive islands for ThemeCustomizer, Sidebar, TopBar
- Redux → Nano Stores or Zustand (Astro-compatible)
- Widget system ported to Astro island components

---

## v2.0 — Modular Assembly Architecture

**Target: 2026**

The long-term goal is to move from per-framework template trees to a **module composition system**. Instead of copying one of 6 full template trees and transforming it, the scaffold assembles from interchangeable modules:

```
SHARED_CORE         ← pages, theme/sidebar logic, utilities
+ FRAMEWORK_ROUTER  ← react-router-dom | tanstack | next/navigation
+ STATE_ADAPTER     ← redux | zustand | jotai
+ STYLING_LAYER     ← mui | mui-tailwind | shadcn | tailwind
+ PLATFORM_LAYER    ← web | pwa | electron
```

**Why this matters:** The current approach has 5 full template trees covering maybe 12 tested combinations. The modular approach would cover all ~60 combinations from ~12 modules, with each module independently testable.

### v2.0 also includes
- **`npx create-terakota`** — Published to npm registry. Zero-install project creation.
- **Interactive browser configurator** — Visual template preview before scaffolding.
- **Foundation DevTools** — Runtime panel for layout/theme/state inspection.
- **Plugin API** — Third-party templates and feature modules.

---

## Feature Requests & Community Input

The roadmap is informed by:
1. Issues and discussions in this repository
2. Usage patterns from the Terakota commercial product
3. Community feedback via [terakota.live](https://terakota.live)

To request a feature or vote on existing ones, use the [Discussions](https://github.com/Intacata/terakota-lite/discussions) tab.

---

## What Is Explicitly Out of Scope

Foundation intentionally stays focused. These things will not be added:

| Item | Reason |
|---|---|
| Data fetching layer (React Query, SWR) | Out of scope — add to generated project yourself |
| Backend / API routes | Foundation is a frontend scaffold |
| Authentication logic (tokens, sessions) | Auth pages are provided; backend integration is your responsibility |
| Database ORM | Out of scope |
| E2E test setup (Playwright, Cypress) | May be added as optional feature in v1.5 |
| Deployment configuration | Add your own Dockerfile / Vercel / Netlify config |

These are deliberate omissions. Foundation's purpose is to give you a complete frontend dashboard shell — not to make technology decisions that belong to your specific project.
