# Capability Matrix

This document defines every combination of framework, styling, platform, and features that Foundation supports. The CLI enforces this matrix — options that are not supported for a given framework are not shown.

---

## Framework × Styling

| Styling | Vite | TanStack | CRA | Next.js App | Next.js Pages | Astro |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| MUI 7 | ✅ | — | ✅ | ✅ | ✅ | — |
| MUI 7 + Tailwind CSS | ✅ | — | ✅ | ✅ | ✅ | — |
| MUI 7 + Shadcn + Tailwind | ✅ | — | — | — | — | — |
| Shadcn + Tailwind | ✅ | — | — | — | — | — |
| Tailwind CSS Only | ✅ | — | — | — | — | ✅ |
| Bootstrap 5 + MUI 7 | ✅ | — | — | — | — | — |
| CSS Modules | ✅ | — | — | — | — | — |
| MUI 6 | — | ✅ | — | — | — | — |
| MUI 6 + Tailwind CSS | — | ✅ | — | — | — | — |
| MUI 6 + Shadcn + Tailwind | — | ✅ | — | — | — | — |

> **Why MUI 6 for TanStack?** TanStack Router uses Vite 4 which bundles esbuild 0.18. MUI 7's new ESM subpath format requires esbuild 0.19+, which is incompatible with macOS 10.15 Catalina. MUI 6 works correctly with esbuild 0.18.

---

## Framework × Platform

| Platform | Vite | TanStack | CRA | Next.js App | Next.js Pages | Astro |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Web Only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web + PWA | ✅ | ✅ | — | ✅ | ✅ | — |
| Web + PWA + Electron | ✅ | — | — | — | — | — |
| Electron Only | ✅ | — | — | — | — | — |

---

## Framework × Dashboard Completeness

| | Vite | TanStack | CRA | Next.js App | Next.js Pages | Astro |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Full dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| 8-variant layout system | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Redux Toolkit state | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Auth pages | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| i18n / RTL | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Widget system | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Theme customiser | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Toast system | ✅ | ✅ | ✅ | ✅ | ✅ | — |

---

## State Management Support

All full-dashboard templates use **Redux Toolkit**. The template source code uses `useDispatch`, `useSelector`, and Redux slices throughout — state management is not currently a variable axis.

| State manager | Status |
|---|---|
| Redux Toolkit | ✅ All full-dashboard templates |
| Zustand | 🔷 Roadmap — v1.5 |
| Jotai | 🔷 Roadmap — v1.5 |
| Context only | 🔷 Roadmap |

---

## Language Support

Both TypeScript and JavaScript are available for all full-dashboard templates. TypeScript is the default.

At scaffold time, `.tsx` → `.jsx` and `.ts` → `.js` conversion is applied to all generated files when JavaScript is selected.

---

## Layout Variants

All 8 layout variants are available for all full-dashboard templates. They are switchable at runtime — no rebuild required.

| Key | Description | Right panel |
|---|---|:---:|
| `sidebar-vertical` | Left sidebar + TopBar | — |
| `sidebar-vertical-right` | Left sidebar + TopBar + right panel | ✅ |
| `sidebar-horizontal` | Full-width top nav only | — |
| `sidebar-horizontal-right` | Top nav + right panel | ✅ |
| `sidebar-dual` | Left sidebar + persistent right panel | ✅ |
| `minimal` | Header only, full-width content | — |
| `minimal-right` | Header + slide-in right panel | ✅ |
| `tabbed` | IDE/browser-style tab bar | — |

Switch at runtime:
```typescript
dispatch(setLayoutVariant('tabbed'));
```

---

## Package Version Matrix

Versions locked per framework to ensure compatibility across all supported operating systems, including macOS 10.15 Catalina.

| Package | Vite | TanStack | CRA | Next.js |
|---|---|---|---|---|
| React | 19 | 18.3 | 18.3 | 19 |
| MUI | 7.x | 6.4.x | 7.x | 7.x |
| Vite | 4.5.x | 4.5.x | — | — |
| Next.js | — | — | — | 15.x |
| TanStack Router | — | 1.50.x | — | — |
| esbuild (override) | — | 0.18.20 | — | — |
| Redux Toolkit | 2.3.x | 2.3.x | 2.3.x | 2.3.x |
| react-redux | 9.x | 9.x | 9.x | 9.x |
| i18next | 23.6.x | 23.6.x | 23.6.x | 23.6.x |
| Framer Motion | 11.x | 11.x | 11.x | 11.x |
| Tailwind CSS | 3.x | 3.x | 3.x | 3.x |

---

## CLI Prompt Dependency Tree

The CLI presents options in order. Later options may be filtered based on earlier selections.

```
Framework
  └── Platform         (filtered: Electron only for Vite)
      └── Styling      (filtered: MUI 6 options only for TanStack)
          └── Language (TypeScript / JavaScript — all frameworks)
              └── Layout variant (all 8 — all full-dashboard frameworks)
                  └── Features (filtered: some features framework-specific)
                      └── Package manager (npm / pnpm / yarn)
```

State management is **not prompted** — it is fixed to Redux Toolkit for all templates, and the CLI states this clearly.
