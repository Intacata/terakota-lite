# Architecture Overview

This document is the contributor-facing guide to how Foundation works. For a deep technical reference (including file-level rules for editing templates safely), see [ARCHITECTURE.md](../ARCHITECTURE.md) at the repo root.

---

## The Mental Model

Foundation is a **code generation CLI**. You run `node create.js MyApp`, answer 8 questions, and get a complete working project. What makes Foundation interesting is *how* that project is assembled.

There are two possible approaches to multi-framework scaffold generation:

**Approach A — One tree per combination.** Ship a `tanstack-zustand-shadcn/` folder and a `vite-redux-mui/` folder and so on. Easy to understand, hard to maintain — any change to a shared component has to be applied to every tree.

**Approach B — Shared source trees with transformation.** Ship one source tree per framework, apply targeted transformations at scaffold time. Harder to set up correctly, but changes to shared components only need to happen once.

Foundation uses Approach B. Here is how it works in practice.

---

## Repository Layout

```
terakota-lite / foundation branch
├── create.js                          ← Entrypoint (node create.js <name>)
├── packages/
│   ├── create-terakota/
│   │   ├── src/
│   │   │   ├── index.ts               ← CLI prompts + capability matrix
│   │   │   ├── scaffold.ts            ← File copier + package.json generator
│   │   │   ├── types.ts               ← FoundationConfig type
│   │   │   ├── banner.ts              ← ASCII banner + completion message
│   │   │   └── utils.ts               ← Name validation
│   │   └── dist/index.cjs             ← Compiled bundle (committed to git)
│   └── templates/
│       ├── foundation-vite/           ← Vite + MUI 7 (no Tailwind)
│       ├── foundation-vite-tailwind/  ← Vite + MUI 7 + Tailwind ← Primary
│       ├── foundation-tanstack/       ← TanStack Router + MUI 6 + Tailwind
│       ├── foundation-next-app/       ← Next.js App Router + MUI 7
│       ├── foundation-cra/            ← CRA / Webpack + MUI 7
│       └── foundation-astro/          ← Astro basic starter
└── docs/
```

---

## The Scaffold Pipeline

When you run `node create.js MyApp` and confirm, this is what happens:

```
createProject(config, __dirname)
  │
  ├─ resolveTemplateKey(config)
  │    Looks at framework + styling → returns which template folder to copy.
  │    "vite + mui-tailwind" → foundation-vite-tailwind
  │    "tanstack + any"      → foundation-tanstack
  │
  ├─ copyAndTransform(templateDir, targetDir, config)
  │    Copies every file, applying two transformations:
  │    1. String substitution (TERAKOTA_FOUNDATION_NAME → MyApp etc.)
  │    2. @if:feature blocks — strips or keeps conditional sections
  │
  ├─ generatePackageJson(config)
  │    Assembles package.json dynamically:
  │    - deps based on framework, styling, platform, features
  │    - pinned versions for Catalina safety
  │    - overrides.esbuild for TanStack
  │
  ├─ Writes .npmrc (legacy-peer-deps=true)
  ├─ Writes .env.example
  ├─ Writes .gitignore
  └─ Writes project README.md
```

---

## The Transformation System

### String substitutions

Every text file in the template is scanned and these placeholders are replaced:

| Placeholder | Replaced with | Example |
|---|---|---|
| `TERAKOTA_FOUNDATION_NAME` | Project name as entered | `MyApp` |
| `terakota-foundation-name` | Lowercase-hyphen | `my-app` |
| `TerakotaFoundationName` | PascalCase | `MyApp` |
| `TERAKOTA_LAYOUT_VARIANT` | Chosen layout variant | `sidebar-vertical-right` |

### Feature flags (`@if:` blocks)

Templates use comment-based conditional blocks:

```typescript
/*@if:widgets*/
import { Route as WidgetsImport } from './routes/widgets'
const WidgetsRoute = WidgetsImport.update(...)
/*@endif:widgets*/
```

When `widgets` is in the user's selected features, the block content is kept (with the comment markers removed). When it is not selected, the entire block is removed.

**Critical rule:** These blocks cannot appear directly inside JSX element position. A bare `/* */` comment between JSX children is invalid syntax. Use array patterns or conditional expressions instead.

---

## The Capability Matrix

`src/index.ts` contains a `CAPABILITIES` object that defines what each framework actually supports:

```typescript
const CAPABILITIES = {
    vite: {
        fullDashboard: true,
        stylingOptions: ['mui', 'mui-tailwind', 'mui-shadcn', 'shadcn', 'tailwind', 'bootstrap-mui', 'css-modules'],
        platforms: ['pwa', 'electron', 'electron-only', 'web'],
    },
    tanstack: {
        fullDashboard: true,
        stylingOptions: ['mui', 'mui-tailwind', 'shadcn'],
        platforms: ['web', 'pwa'],
    },
    // ...
}
```

The CLI filters every prompt against this matrix. If an option is not listed, it is not shown. This prevents the worst failure mode of scaffold CLIs: showing choices that silently produce broken projects.

---

## Template Tree Count

| Approach | Trees | Covers |
|---|---|---|
| Current (per-framework source trees) | 5 full + 1 starter | ~15 tested combos |
| Per-framework × styling (full separation) | 25+ | All styling combos, unsustainable |
| Per-framework × state manager (full separation) | 15+ | All state combos, unsustainable |
| Target v2.0 (shared modules + per-axis swaps) | ~12 modules | ~60 combos from shared base |

The current approach is deliberate. We maintain 5 full template trees (manageable) and use transformation to handle the variable axes (styling, features, layout). State manager flexibility requires a deeper refactor — see [Roadmap](roadmap.md).

---

## What Is Shared Across Templates

These files are **structurally identical** across all full-dashboard templates (some require framework-specific adaptations like `'use client'` for Next.js or `process.env` vs `import.meta.env`):

- `features/theme/themeSlice.ts` — Redux slice for theme mode, colours, RTL
- `features/theme/themeUtils.ts` — MUI theme factory function
- `features/sidebar/sidebarSlice.ts` — Sidebar state + layout variant
- `components/utility/ThemeCustomizer.tsx` — Slide-in theme panel
- `components/utility/Toast.tsx` — Toast notification system
- `pages/Home.tsx`, `Settings.tsx`, `ThemeStudio.tsx`, `Widgets.tsx`
- `i18n/` — Translation files and i18next config
- `store/index.ts` — Redux store (minor env-var differences)

These files differ **per framework** because they call framework-specific routing hooks:

- `layouts/components/Sidebar/index.tsx`
- `layouts/components/TopBar/index.tsx`
- `layouts/variants/*.tsx`

---

## Rebuilding the CLI Bundle

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

The compiled `dist/index.cjs` is committed to git so users can run `node create.js` without any build step.

---

## For AI Agents

If you are an AI assistant working on this codebase, the essential rules:

1. After any `str_replace` on a `.tsx` or `.ts` template file, verify no literal `\n` was introduced: `grep -rn "\\\\n" packages/templates/`
2. `/*@if:xxx*/` blocks must never appear directly between JSX elements — they produce parse errors
3. `devDeps` must be declared before any line that assigns to `devDeps[x]` in `scaffold.ts`
4. TanStack uses MUI 6, not MUI 7 — this is permanent for macOS Catalina support
5. The `CAPABILITIES` object is the source of truth for what the CLI offers. Do not add options to `CAPABILITIES` that the template source doesn't actually support
6. See [ARCHITECTURE.md](../ARCHITECTURE.md) for the complete technical reference
