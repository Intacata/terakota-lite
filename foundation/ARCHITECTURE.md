# Terakota Foundation — Architecture, Versioning & Roadmap

> **For contributors and AI agents**: This document is the authoritative reference. Read it fully before making changes.

---

## 1. What Foundation Is

Foundation is a **Node.js-powered CLI scaffold** (`create-terakota`) that generates a full-featured dashboard application from a curated set of framework templates. Think of it as `create-react-app` but opinionated toward dashboards, multi-framework, and with runtime layout switching.

The key design insight: rather than generating minimal boilerplate, Foundation scaffolds a **complete, working dashboard** — with sidebar, theming, auth pages, i18n, layout variants, and widget system — pre-wired and ready to customise.

---

## 2. Repository Structure

```
improved/                                    ← monorepo root
├── create.js                                ← entry point: node create.js <ProjectName>
├── packages/
│   ├── create-terakota/
│   │   ├── src/
│   │   │   ├── index.ts                     ← CLI prompts + capability matrix
│   │   │   ├── scaffold.ts                  ← package.json generator + file copier
│   │   │   ├── types.ts                     ← FoundationConfig type
│   │   │   ├── banner.ts                    ← ASCII art + DONE_BANNER
│   │   │   └── utils.ts                     ← validateProjectName
│   │   └── dist/index.cjs                   ← compiled CLI bundle (rebuilt via esbuild)
│   └── templates/
│       ├── foundation-vite/                 ← Vite + MUI 7 (no Tailwind)
│       ├── foundation-vite-tailwind/        ← Vite + MUI 7 + Tailwind ← PRIMARY tested template
│       ├── foundation-tanstack/             ← TanStack Router + MUI 6 + Tailwind
│       ├── foundation-next-app/             ← Next.js App Router + MUI 7
│       ├── foundation-cra/                  ← CRA / Webpack + MUI 7
│       └── foundation-astro/               ← Astro basic starter (stub)
└── scripts/setup.js
```

---

## 3. How Scaffolding Works

### 3.1 The CLI flow

```
node create.js <name>
  └── prompts (framework → platform → styling → language → layout → features → pm)
      └── createProject(config, __dirname)
          ├── resolveTemplateKey(config)    → picks which template folder to copy
          ├── copyAndTransform(src, dest)   → copies files + applies @if:xxx transformations
          ├── generatePackageJson(config)   → generates package.json for the project
          ├── writeEnvExample()
          ├── writeGitignore()
          ├── writeReadme()
          └── writes .npmrc (legacy-peer-deps=true)
```

### 3.2 Template transformation system (`@if:xxx` blocks)

Templates use comment-based conditional blocks:

```typescript
/*@if:widgets*/
import { Route as WidgetsImport } from './routes/widgets'
/*@endif:widgets*/
```

The scaffold's regex engine strips these blocks (keeping or removing the inner content) based on the user's feature selections. **This works in `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css` — but NOT in JSX element position** (a raw `/* */` comment between JSX elements is invalid syntax). Use `{/* */}` or move conditional logic to array/object literals.

### 3.3 Variable substitutions applied at scaffold time

| Template placeholder | Replaced with |
|---|---|
| `TERAKOTA_FOUNDATION_NAME` | project name (e.g. `Dashbuds`) |
| `terakota-foundation-name` | lowercase-hyphen version |
| `TerakotaFoundationName` | PascalCase version |
| `TERAKOTA_LAYOUT_VARIANT` | chosen layout (e.g. `sidebar-vertical-right`) |

---

## 4. Capability Matrix (Current v1.3.x)

What each framework template actually supports. The CLI only shows options that are real.

| Axis | Vite | TanStack | CRA | Next.js App | Next.js Pages | Astro |
|---|---|---|---|---|---|---|
| **Template type** | Full dashboard | Full dashboard | Full dashboard | Full dashboard | Full dashboard | Basic starter |
| **State management** | Redux (fixed) | Redux (fixed) | Redux (fixed) | Redux (fixed) | Redux (fixed) | — |
| **MUI version** | v7 | v6* | v7 | v7 | v7 | — |
| **Tailwind** | ✓ (optional) | ✓ (optional) | ✓ (optional) | ✓ (optional) | ✓ (optional) | ✓ |
| **Shadcn** | ✓ | ✓ | — | — | — | — |
| **PWA** | ✓ | ✓ | — | ✓ | ✓ | — |
| **Electron** | ✓ | — | — | — | — | — |
| **Layout variants** | 8 | 8 | 8 | 8 | 8 | — |
| **Auth pages** | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **i18n / RTL** | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Widgets system** | ✓ | ✓ | ✓ | ✓ | ✓ | — |

*TanStack uses MUI 6 because MUI 7 ESM requires esbuild 0.19+, which requires macOS 12+. MUI 6 works with esbuild 0.18 (macOS 10.15 Catalina compatible).

---

## 5. What Is Genuinely Transformable vs Fixed

### Currently transformable at scaffold time (works reliably):
- **Layout variant** — TERAKOTA_LAYOUT_VARIANT replacement in sidebarSlice
- **Optional features** — @if:widgets / @if:i18n / @if:auth blocks remove files and imports
- **Language** — .tsx → .jsx / .ts → .js rename
- **Styling** — deps added/removed, Tailwind config written, postcss.config written
- **Project name** — all three substitution forms

### Currently fixed (same across all configs within a framework):
- **State manager** — all full-dashboard templates use Redux throughout
- **Component library** — MUI (or MUI 6 for TanStack)
- **Router** — react-router-dom for Vite/CRA, TanStack Router for TanStack, next/navigation for Next.js

### Roadmap: what would enable true flexibility

| Feature | Approach | Tree cost |
|---|---|---|
| Zustand state manager | Separate `features/theme/themeSlice.zustand.ts` + transform | +1 variant per template |
| Jotai state manager | Same pattern | +1 variant per template |
| Shadcn-only (no MUI) layout | Separate layout component set | +1 template per framework |
| TanStack + Shadcn | Add radix/shadcn deps + tailwind on top of MUI 6 layout | ✓ Already planned |

---

## 6. Template Tree Count Analysis

### Current approach (shared source + CLI transformation):
- **Full template trees**: 5 (vite, vite-tailwind, tanstack, next-app, cra)
- **Total files per template**: ~38-42

### If we added alternative state managers via separate source trees:
- 3 state managers × 5 frameworks = **15 trees**

### If we added styling variants as separate trees:
- 3 styling variants × 5 frameworks = **15 trees**

### Combined (state + styling separate trees):
- 3 × 3 × 5 = **45 trees** — unsustainable

### Recommended hybrid approach (intersection-aware):
Use **shared modules** + **per-axis swappable files** rather than full trees:
```
shared/                         ← framework-agnostic (layout components, utils, types)
per-framework/tanstack/         ← router-specific files only
per-state/redux/                ← store, slices
per-state/zustand/              ← zustand equivalent
per-styling/mui/                ← MUI-specific layout
per-styling/tailwind-only/      ← tailwind layout
```
Scaffold assembles by combining the relevant modules. **Estimated tree count: 8-12 modules** covering all 45+ combinations.

---

## 7. Intersection Map (Technology Compatibility)

```
          MUI 7   MUI 6   Tailwind   Shadcn   Bootstrap
Vite       ✓       —       ✓          ✓         ✓
TanStack   —       ✓       ✓          ✓*        —
Next.js    ✓       —       ✓          ✓**       —
CRA        ✓       —       ✓          —         —
Astro      —       —       ✓          —         —

* Shadcn works alongside MUI 6 in TanStack (Radix primitives don't conflict)
** Next.js Shadcn support planned (different from Vite Shadcn setup due to RSC)

          Redux   Zustand   Jotai   Context
Vite       ✓       future    future   future
TanStack   ✓       future    future   —
Next.js    ✓       future    —        —
CRA        ✓       —         —        —

          PWA   Electron   SSR/RSC
Vite       ✓     ✓           —
TanStack   ✓     —           —
Next.js    ✓     —           ✓
CRA        —     —           —
Astro      —     —           ✓
```

---

## 8. macOS 10.15 Catalina Compatibility Notes

This is a critical constraint that affects every package version decision.

| Issue | Detail | Solution |
|---|---|---|
| esbuild 0.19+ | Built for macOS 12+ (`_SecTrustCopyCertificateChain`) | Pin esbuild ≤ 0.18.20 |
| Vite 5+ | Uses esbuild 0.19 | Pin Vite to 4.5.x |
| MUI 7 + esbuild 0.18 | MUI 7 ESM uses `.js` subpath imports esbuild 0.18 can't resolve | Use MUI 6 for TanStack; MUI 7 works because Vite 4 does NOT force the pinned esbuild for pre-bundling |
| @tanstack/react-router 1.114+ | Pulls in esbuild 0.19 transitively | Pin to ^1.50.0; use npm `overrides: {esbuild: "0.18.20"}` |
| npm 11 strict peers | React 19 + MUI 7 peer mismatch | `.npmrc: legacy-peer-deps=true` + `--legacy-peer-deps` flag |

---

## 9. Version History & Key Milestones

| Version | Date | Status | Key Changes |
|---|---|---|---|
| **v1.0** | Before this session | Working | Original CRA-derived CLI, basic scaffold |
| **v1.1** | Before this session | Working | Vite PWA template added, confirmed working |
| **v1.2.0** | Session start | Broken | UI/UX fixes attempted (dark mode, RTL, sidebar push, navigation) |
| **v1.2.1** | Fix | Broken | JSX `/*@if*/` syntax fix — but `\n` corruption introduced |
| **v1.2.2** | Fix | Broken | devDeps ordering error (`devDeps used before init`) |
| **v1.2.3** | Fix | Broken | `\n` literal corruption in Sidebar + ThemeCustomizer |
| **v1.2.4** | Fix | ✅ Vite works | Corruption fixed, `legacy-peer-deps` added |
| **v1.2.5** | Fix | Broken TanStack | esbuild overrides for TanStack; router pinned to 1.50 |
| **v1.2.6** | Fix | Broken TanStack | MUI always included for TanStack (was skipped for Shadcn choice) |
| **v1.2.7** | Fix | Broken TanStack | MUI 6 for TanStack (MUI 7 needs esbuild 0.19+); overrides only for TanStack |
| **v1.2.8** | Fix | Broken TanStack | Redux always included for TanStack (was skipped when Zustand selected) |
| **v1.3.0** | Architecture | Partial | Honest capability matrix; CLI removed fake Zustand/Jotai options |
| **v1.3.1** | Current | Testing | TanStack blank page fixed (index.tsx was duplicating __root.tsx); Next.js full dashboard ported; both Next.js router options added; Shadcn added to TanStack CLI |

### Recommended checkpoint versions to keep:
1. **v1.2.4** — Last known working Vite PWA state before TanStack work began. Safe fallback.
2. **v1.3.0** — Architecture overhaul with honest capability matrix. Good conceptual baseline.
3. **v1.3.1** — Current: TanStack + Next.js full dashboards working (pending your test confirmation).

---

## 10. Known Limitations & Honest Assessment

| Item | Status | Notes |
|---|---|---|
| CLI back navigation | ❌ Not implemented | `prompts` library doesn't support back. Requires custom prompt loop. Planned. |
| Zustand / Jotai options | ❌ Not available | Source trees are Redux-based. Roadmap: add per-state swap files. |
| TanStack + Shadcn | ✅ v1.3.1 | Adds Radix/shadcn deps on MUI 6 base |
| Next.js Pages Router | ⚠️ Uses App Router source | Full Pages Router port is a separate task |
| Next.js PWA | ✅ v1.3.1 | Added to capability matrix |
| Auto-install timeout | ⚠️ 5min limit | Falls back to manual `npm install` gracefully |
| Astro full dashboard | ❌ Basic starter only | Requires full port from Vite |
| Widget system | ✅ All full templates | Clock, KPI, Text widgets. Shadcn styling variants planned. |
| Dark mode bug | ✅ Fixed in v1.2+ | Race condition between init effect and persistence effect fixed |
| RTL layout | ✅ Fixed | Sidebar, FAB, content direction all RTL-aware |
| Content push on sidebar open | ✅ Fixed | Smooth marginLeft/Right transition |

---

## 11. File Intersection & Sharing Strategy

### Files that are identical across all templates (candidates for `shared/`):
- `features/theme/themeSlice.ts`
- `features/theme/themeUtils.ts`
- `features/sidebar/sidebarSlice.ts`
- `components/utility/ThemeCustomizer.tsx`
- `components/utility/Toast.tsx`
- `pages/Home.tsx`, `Settings.tsx`, `ThemeStudio.tsx`, `Widgets.tsx`
- `i18n/` directory
- `store/index.ts` (except Next.js uses `process.env` vs `import.meta.env`)

### Files that differ by framework:
- `routes/` or `app/` (routing system)
- `main.tsx` / `_app.tsx` (entry point)
- `layouts/components/Sidebar/index.tsx` (router hook calls)
- `layouts/components/TopBar/index.tsx` (router hook calls)

### The intersection build model (v2.0 target):
```
scaffold assembles:
  SHARED_CORE (theme, sidebar, widgets, pages)
  + FRAMEWORK_ROUTER (react-router-dom | tanstack | next/navigation)
  + STATE_ADAPTER (redux | zustand | jotai)
  + STYLING_LAYER (mui-theme | tailwind-config | shadcn-config)
```

---

## 12. How to Rebuild the CLI Bundle

After any change to `src/`:
```bash
cd packages/create-terakota
npx esbuild src/index.ts \
  --bundle --platform=node --target=node18 --format=cjs \
  --outfile=dist/index.cjs \
  --define:'import.meta.url=__importMetaUrl' \
  '--banner:js=#!/usr/bin/env node
const __importMetaUrl = require("url").pathToFileURL(__filename).href;'
```

Then repackage:
```bash
cd ../..
zip -r /path/to/output.zip . \
  --exclude "*/node_modules/*" --exclude "*/.git/*" \
  --exclude "*/dist/*" --exclude "*.zip" -q
zip output.zip packages/create-terakota/dist/index.cjs -q
```

---

## 13. Testing Checklist

For each release, test these combinations before shipping:

| Test | Framework | Styling | Layout | Features |
|---|---|---|---|---|
| Primary | Vite | MUI + Tailwind | sidebar-vertical-right | all |
| Secondary | TanStack | MUI 6 | sidebar-vertical | all |
| Next.js | Next App Router | MUI + Tailwind | sidebar-vertical | all |
| Minimal | Vite | MUI only | minimal | none |

**Per-test checklist:**
- [ ] `node create.js <name>` completes without error
- [ ] `npm install` succeeds (or `npm install --legacy-peer-deps`)
- [ ] `npm run dev` starts without terminal errors
- [ ] Browser: page renders (not blank)
- [ ] Browser: no console errors (except known SW favicon warning)
- [ ] Dark mode toggle works
- [ ] Sidebar open/close works
- [ ] Navigate to /settings, /widgets, /theme-studio
- [ ] Layout variant switch works at runtime

---

## 14. For AI Agents Continuing This Work

**The golden rule**: Before touching any `.tsx` template file, check if `/*@if:xxx*/` blocks exist. If you str_replace inside them, the regex `$1` backreference must capture real newlines, not `\n` literals. Always verify with `grep -n "\\\\n"` after editing.

**The second rule**: The CLI capability matrix in `src/index.ts` is the contract. If a framework template can't actually support a feature, remove it from that framework's `stylingOptions` / `platforms` array — don't leave it as a broken silent option.

**The third rule**: TanStack uses MUI 6, not MUI 7. This is permanent until macOS Catalina support is dropped.

**The fourth rule**: `generatePackageJson()` must declare `devDeps` before using it. The function reads deps and devDeps top-to-bottom; any assignment to `devDeps[x]` must come after `const devDeps = {...}` on line ~176.
