# Getting Started with Terakota Foundation

This guide walks you through installing Foundation, scaffolding your first project, and understanding the generated codebase.

---

## Prerequisites

| Requirement | Minimum | Recommended |
|---|---|---|
| Node.js | 18.0.0 | 20 LTS or 22 LTS |
| npm | 8.0.0 | 11.x |
| macOS | 10.15 Catalina | 12+ |
| Windows | 10 | 11 |
| Linux | Ubuntu 20.04 | Ubuntu 22.04+ |
| Git | Any | Latest |

You do **not** need to install any global package. Foundation runs directly from the cloned repository.

---

## Installation

### Method 1 — Clone the repository (recommended for developers)

```bash
# Clone terakota-lite and enter the Foundation branch
git clone https://github.com/Intacata/terakota-lite.git
cd terakota-lite
git checkout foundation
```

That's it. No `npm install` needed at the root. The CLI is a self-contained compiled bundle at `packages/create-terakota/dist/index.cjs`.

### Method 2 — Download a release archive

Visit the [Releases page](https://github.com/Intacata/terakota-lite/releases) and download the latest `Terakota-Foundation-vX.X.X.zip`.

```bash
unzip Terakota-Foundation-v1.3.1.zip -d Terakota-Foundation
cd Terakota-Foundation
```

### Method 3 — npx *(coming in v1.4)*

```bash
npx create-terakota MyApp
```

---

## Scaffolding Your First Project

Run the CLI from the Foundation root and follow the interactive prompts:

```bash
node create.js MyApp
```

### What the prompts ask

**1. Framework** — Choose your build system and rendering model.

| Option | Description |
|---|---|
| Vite | SPA with HMR. Best for PWA and Electron apps. |
| TanStack Router | Type-safe file-based SPA routing. |
| CRA | Webpack-based legacy stack. |
| Next.js App Router | Server components + SSR. |
| Next.js Pages Router | Classic Next.js routing. |
| Astro | Content/MPA architecture (basic starter). |

**2. Platform** — Where your app runs.

| Option | Includes |
|---|---|
| Web + PWA | Offline service worker, manifest, install prompt |
| Web + PWA + Electron | Everything above + desktop build |
| Electron Only | Desktop-only, no PWA service worker |
| Web Only | Plain SPA, no PWA or desktop |

> Electron is available for Vite only. PWA is available for Vite, TanStack, and Next.js.

**3. Styling** — The visual framework.

| Option | Libraries |
|---|---|
| MUI 7 | Material UI components, Emotion |
| MUI 7 + Tailwind CSS | MUI layout + Tailwind utility classes |
| MUI 7 + Shadcn + Tailwind | MUI + Radix/Shadcn headless components + Tailwind |
| Shadcn + Tailwind | Shadcn only, no MUI |
| Tailwind CSS Only | Pure Tailwind |
| Bootstrap 5 + MUI 7 | Bootstrap grid + MUI components |
| CSS Modules | Vanilla scoped CSS |

> Available options depend on the framework selected. The CLI only shows combinations that are actually supported.

**4. Language** — TypeScript (default) or JavaScript.

**5. Layout variant** — The app frame structure. All 8 variants can be switched at runtime — this is just the default.

**6. Optional features** — Selected with spacebar. All can be deselected.

| Feature | What's included |
|---|---|
| i18n / RTL | i18next, English + Arabic, direction switcher |
| Widgets / Dashboard | Widget canvas with Clock, KPI, Text widgets |
| Auth pages | Login, Register, Lock Screen |
| Dark / Light / System theme | Theme toggle persisted to localStorage |
| Toast notifications | Snackbar dispatch system |
| Web Vitals | Performance metric tracking |
| PWA Context | Install prompt component |
| Storybook | Component explorer setup |
| Guided tour | react-joyride onboarding |

**7. Package manager** — npm, pnpm, or yarn.

---

## Running Your Project

After scaffolding completes:

```bash
cd MyApp

# If auto-install succeeded during scaffold:
npm run dev

# If auto-install timed out (common on first run with many packages):
npm install
npm run dev
```

Open `http://localhost:3009` in your browser.

> All Foundation templates default to port 3009.

---

## First Steps in the Generated Project

### Switch the layout variant

Open Settings → Layout, or dispatch programmatically:

```typescript
import { useDispatch } from 'react-redux';
import { setLayoutVariant } from '~/features/sidebar/sidebarSlice';

const dispatch = useDispatch();
dispatch(setLayoutVariant('sidebar-horizontal'));
```

Available variants: `sidebar-vertical`, `sidebar-vertical-right`, `sidebar-horizontal`, `sidebar-horizontal-right`, `sidebar-dual`, `minimal`, `minimal-right`, `tabbed`.

### Toggle dark mode

```typescript
import { setTheme } from '~/features/theme/themeSlice';
dispatch(setTheme('dark')); // 'light' | 'dark' | 'system'
```

### Add a new page

**Vite** — Create `src/routes/analytics.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router'; // TanStack
// or for Vite react-router-dom:
import { createBrowserRouter } from 'react-router-dom';
```

**Next.js** — Create `src/app/(dashboard)/analytics/page.tsx`:
```tsx
'use client';
export default function AnalyticsPage() {
    return <div>Analytics</div>;
}
```

### Add a Redux slice

```bash
# Create src/features/analytics/analyticsSlice.ts
# Register it in src/store/index.ts
```

---

## Install from a Specific Version

All Foundation releases are archived as GitHub Release assets. To install a specific version:

```bash
# Using git tags (after tagging is set up)
git clone https://github.com/Intacata/terakota-lite.git
cd terakota-lite
git checkout foundation
git checkout tags/foundation-v1.3.1

node create.js MyApp
```

Or download the release archive directly from the [Releases page](https://github.com/Intacata/terakota-lite/releases).

---

## Troubleshooting

**`npm install` times out during scaffolding**
Run it manually: `cd MyApp && npm install`

**Port 3009 already in use**
Edit `vite.config.ts` (or `next.config.ts`) and change the port, or kill the process using it.

**`dyld: Symbol not found: _SecTrustCopyCertificateChain` on macOS Catalina**
This is an esbuild 0.19+ compatibility issue. Foundation templates pin esbuild to 0.18.20 for Catalina. If you see this error, ensure you're using the correct template — TanStack has this handled via `overrides` in `package.json`.

**Blank page after `npm run dev` (TanStack)**
Ensure `src/routes/index.tsx` contains a redirect (`<Navigate to="/home" replace />`), not a duplicate root component.

**`Module not found: @mui/material-nextjs`**
This package is not required by Foundation's Next.js template. If you see this error, you're likely running an older version (pre v1.3.1). Update to the latest release.

---

## Next Steps

- [Capability Matrix](capability-matrix.md) — All framework × styling combinations
- [Stable Combinations](stable-combinations.md) — Tested and confirmed working configs
- [Architecture](architecture.md) — How the scaffold and templates work
- [Roadmap](roadmap.md) — What's coming next
- [Contributing](../CONTRIBUTING.md) — How to contribute
