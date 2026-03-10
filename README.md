<div align="center">

```
████████╗███████╗██████╗  █████╗ ██╗  ██╗ ██████╗ ████████╗ █████╗
   ██║   ██╔════╝██╔══██╗██╔══██╗██║ ██╔╝██╔═══██╗╚══██╔══╝██╔══██╗
   ██║   █████╗  ██████╔╝███████║█████╔╝ ██║   ██║   ██║   ███████║
   ██║   ██╔══╝  ██╔══██╗██╔══██║██╔═██╗ ██║   ██║   ██║   ██╔══██║
   ██║   ███████╗██║  ██║██║  ██║██║  ██╗╚██████╔╝   ██║   ██║  ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
```

### Terakota Foundation

**Multi-framework · Multi-variant · Instantly buildable**

*The open-source scaffold layer of [Terakota](https://terakota.live) — a product by [Intacata](https://intacata.com)*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.3.2-brightgreen.svg)](CHANGELOG.md)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-success.svg)](https://nodejs.org)
[![Branch](https://img.shields.io/badge/branch-foundation-orange.svg)](https://github.com/intacata-org/terakota-lite/tree/foundation)
[![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)](#stable-combinations)

</div>

---

## What is Terakota Foundation?

**Terakota Foundation** is an interactive CLI that scaffolds full-featured, production-ready dashboard applications in seconds. It is the open-source, community-facing layer of [Terakota](https://terakota.live) — a professional React dashboard platform developed by [Intacata](https://intacata.com).

Select your framework, styling approach, layout variant, and optional features. Foundation assembles a complete, working codebase — routing, Redux state, theming, auth pages, i18n, and an 8-variant layout system — pre-wired and ready to extend.

```bash
node create.js MyApp
# → prompts you through 8 options
# → generates a complete dashboard project
# → runs npm install automatically
# → cd MyApp && npm run dev
```

Foundation is **free forever**. No account required. No telemetry.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Frameworks & Stable Combinations](#frameworks--stable-combinations)
- [What You Get](#what-you-get)
- [CLI Walkthrough](#cli-walkthrough)
- [Project Structure](#project-structure-generated-output)
- [Compatibility](#compatibility)
- [Development & Contributing](#development--contributing)
- [Versioning](#versioning)
- [Roadmap](#roadmap)
- [About Terakota & Intacata](#about-terakota--intacata)
- [License](#license)

---

## Quick Start

### Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18.0.0 |
| npm | 8.0.0 (npm 11 fully supported) |
| macOS | 10.15 Catalina or later |
| Windows / Linux | Node 18+ (all versions supported) |

### Option A — Clone from GitHub (recommended)

```bash
# 1. Clone the terakota-lite repository
git clone https://github.com/intacata-org/terakota-lite.git

# 2. Enter the repo and switch to the Foundation branch
cd terakota-lite
git checkout foundation

# 3. Scaffold your project
node create.js MyApp

# 4. Start developing
cd MyApp
npm run dev
```

### Option B — Download a release archive

Go to [Releases](https://github.com/intacata-org/terakota-lite/releases) and download the latest `Terakota-Foundation-vX.X.X.zip`.

```bash
unzip Terakota-Foundation-v1.3.2.zip -d Terakota-Foundation
cd Terakota-Foundation
node create.js MyApp
cd MyApp && npm run dev
```

### Option C — Install via npx *(coming soon)*

```bash
npx create-terakota MyApp
```

> If `npm install` times out during scaffolding, run it manually inside your generated project folder.

---

## Frameworks & Stable Combinations

Full details in [docs/capability-matrix.md](docs/capability-matrix.md).

| Framework | Dashboard | Styling options | PWA | Electron | Tested status |
|---|---|---|---|---|---|
| **Vite** | Full | MUI 7, MUI 7 + Tailwind, Shadcn + Tailwind, Tailwind only, Bootstrap + MUI 7, CSS Modules | ✅ | ✅ | ✅ **Stable** |
| **TanStack Router** | Full | MUI 6, MUI 6 + Tailwind, Shadcn + MUI 6 | ✅ | — | ✅ **Stable** |
| **CRA** (Webpack) | Full | MUI 7, MUI 7 + Tailwind | — | — | ✅ Stable (legacy) |
| **Next.js App Router** | Full | MUI 7, MUI 7 + Tailwind | ✅ | — | 🔶 Beta |
| **Next.js Pages Router** | Full | MUI 7, MUI 7 + Tailwind | ✅ | — | 🔶 Beta |
| **Astro** | Basic starter | Tailwind | — | — | 🔷 Starter only |

**State management**: All full-dashboard templates use **Redux Toolkit**. Zustand and Jotai variants are on the [roadmap](#roadmap).

---

## What You Get

### 🗂 Eight layout variants — switchable at runtime

| Variant key | Description |
|---|---|
| `sidebar-vertical` | Left sidebar + TopBar, collapsible to mini-mode |
| `sidebar-vertical-right` | Left sidebar + TopBar + right info/tools panel |
| `sidebar-horizontal` | Full-width top navigation, no sidebar |
| `sidebar-horizontal-right` | Top nav + collapsible right panel |
| `sidebar-dual` | Left sidebar + persistent right panel (both always visible) |
| `minimal` | Clean header, full-width content area |
| `minimal-right` | Simple header + slide-in right panel |
| `tabbed` | IDE / browser-style tab bar navigation |

Switch at any time — in user settings, programmatically, or from the Theme Studio:

```typescript
import { setLayoutVariant } from '~/features/sidebar/sidebarSlice';
dispatch(setLayoutVariant('sidebar-horizontal'));
```

### 🎨 Theme system

- Light / Dark / System (OS-follow) mode
- Persisted across sessions via localStorage
- RTL / LTR layout direction
- Runtime customisation of colours, typography, border radius, font size
- Theme Studio page built in
- Dynamic favicon that adapts to theme

### 📦 Optional features (selected at scaffold time)

| Feature | What it includes |
|---|---|
| **i18n / RTL** | `i18next` + `react-i18next`, English + Arabic, direction switching |
| **Widget system** | Resizable widget canvas — Clock, KPI card, Text widgets |
| **Auth pages** | Login, Register, Lock Screen, pre-styled |
| **Toast notifications** | MUI Snackbar-based system with dispatch API |
| **Web Vitals** | Performance tracking hooks |
| **PWA** | Service worker, offline support, manifest, install prompt |
| **Electron** | Desktop build target with Electron + Vite |

### 🛠 Core technology stack

| Layer | Technology |
|---|---|
| UI framework | React 18 (TanStack / CRA) · React 19 (Vite / Next.js) |
| Component library | MUI 7 (Vite / CRA / Next.js) · MUI 6 (TanStack) |
| State management | Redux Toolkit + React-Redux |
| Routing | react-router-dom (Vite / CRA) · TanStack Router · next/navigation |
| Styling | Emotion · Styled Components · Tailwind CSS (optional) · Shadcn/ui (optional) |
| Animations | Framer Motion |
| Icons | Iconify |
| Build tool | Vite 4.x · Next.js 15 · Webpack (CRA) |
| Language | TypeScript (default) · JavaScript |

---

## CLI Walkthrough

```
  ✔  Node.js v22.x
  ✔  CLI ready

✔ Choose a framework:
  › ⚡ Vite               — Full dashboard: MUI 7 + Redux. PWA/Electron ready
    ◈  TanStack Router     — Full dashboard: MUI 6 + Redux. Type-safe SPA routing
    ⚛  CRA                 — Full dashboard: MUI 7 + Redux. Webpack (legacy)
    ▲  Next.js App Router  — Full dashboard: MUI 7 + Redux. RSC + SSR
    ▲  Next.js Pages Router— Full dashboard: MUI 7 + Redux. Classic Next.js
    🚀 Astro               — Basic starter. Full dashboard coming soon

✔ Target platform:      › 🌐 Web + PWA — Installable, offline ready
✔ Styling approach:     › MUI 7 + Tailwind CSS
✔ Language:             › TypeScript (recommended)
✔ App frame layout:     › Vertical Sidebar + Right Panel
  State management:       Redux Toolkit
✔ Optional features:    › i18n, widgets, auth, theme, toast
✔ Package manager:      › npm

  Your Terakota Foundation project:
  Name          MyApp
  Framework     vite
  Platform      pwa
  Styling       mui-tailwind
  Language      typescript
  Layout        sidebar-vertical-right
  State mgr     redux
  Features      i18n, widgets, auth, theme, toast

✔ Looks good — scaffold now? › yes
✔ Project files created
✔ Git repository initialised
✔ Dependencies installed
✔ Done! MyApp is ready.
```

---

## Project Structure (generated output)

```
MyApp/
├── src/
│   ├── routes/                    # (Vite) File-based routing
│   │   ├── index.tsx              # Redirects / → /home
│   │   ├── home.tsx
│   │   ├── settings.tsx
│   │   ├── theme-studio.tsx
│   │   ├── widgets.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── lock.tsx
│   ├── layouts/
│   │   ├── DashboardLayout.tsx    # Main shell — reads layout variant from Redux
│   │   ├── components/
│   │   │   ├── Sidebar/           # Collapsible sidebar with mini-mode
│   │   │   ├── TopBar/            # App bar with theme / user controls
│   │   │   └── RightSideBar/      # Slide-in right panel
│   │   └── variants/
│   │       ├── HorizontalLayout.tsx
│   │       ├── MinimalLayout.tsx
│   │       └── TabbedLayout.tsx
│   ├── features/
│   │   ├── theme/                 # themeSlice, themeUtils (MUI theme builder)
│   │   └── sidebar/               # sidebarSlice (layout variant + open state)
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Settings.tsx
│   │   ├── ThemeStudio.tsx
│   │   ├── Widgets.tsx
│   │   ├── Login.tsx
│   │   ├── Registration.tsx
│   │   └── LockScreen.tsx
│   ├── components/utility/
│   │   ├── ThemeCustomizer.tsx    # Slide-in theme panel (colours, layout, RTL)
│   │   ├── Toast.tsx
│   │   └── dashboard/             # Widget registry + widget components
│   ├── store/index.ts             # Redux store
│   ├── i18n/                      # Translations (en, ar) + i18next config
│   └── styles/                    # Global CSS
├── .npmrc                         # legacy-peer-deps=true
├── package.json                   # Versions locked for your OS/platform
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Compatibility

Foundation is actively tested on **macOS 10.15 Catalina** — the most restrictive modern Node environment — and works on all newer macOS, Windows 10+, and Ubuntu 20.04+.

Several package versions are intentionally pinned to maintain Catalina support:

| Package | Pinned version | Reason |
|---|---|---|
| Vite | 4.5.x | Ships esbuild 0.18 internally (Catalina-safe) |
| esbuild (TanStack) | 0.18.20 via `overrides` | esbuild 0.19+ links against macOS 12+ symbols |
| TanStack Router | ^1.50.0 | Versions 1.51+ require Vite 5 / esbuild 0.19+ |
| MUI (TanStack) | 6.x | MUI 7 ESM subpath format requires esbuild 0.19+ |
| MUI (Vite / Next / CRA) | 7.x | Vite 4 handles this correctly without pinning |

---

## Development & Contributing

### Repository layout (this branch)

```
terakota-lite / foundation
├── packages/
│   ├── create-terakota/
│   │   ├── src/              # TypeScript CLI source
│   │   │   ├── index.ts      # Prompts + capability matrix
│   │   │   ├── scaffold.ts   # package.json generator + file copier
│   │   │   ├── types.ts
│   │   │   ├── banner.ts
│   │   │   └── utils.ts
│   │   └── dist/index.cjs    # Compiled CLI bundle (committed)
│   └── templates/
│       ├── foundation-vite/
│       ├── foundation-vite-tailwind/
│       ├── foundation-tanstack/
│       ├── foundation-next-app/
│       ├── foundation-cra/
│       └── foundation-astro/
├── docs/
├── .github/
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── README.md
```

### Rebuilding the CLI after source edits

```bash
cd packages/create-terakota
npx esbuild src/index.ts \
  --bundle --platform=node --target=node18 --format=cjs \
  --outfile=dist/index.cjs \
  --define:'import.meta.url=__importMetaUrl' \
  '--banner:js=#!/usr/bin/env node
const __importMetaUrl = require("url").pathToFileURL(__filename).href;'
```

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

---

## Versioning

Foundation uses [Semantic Versioning](https://semver.org): `MAJOR.MINOR.PATCH`

| Segment | Meaning |
|---|---|
| MAJOR | Breaking changes to CLI interface or generated project structure |
| MINOR | New frameworks, new styling options, new features |
| PATCH | Bug fixes, compatibility fixes, documentation |

Full history: [CHANGELOG.md](CHANGELOG.md)

Current stable: **v1.3.2**

---

## Roadmap

Full detail: [docs/roadmap.md](docs/roadmap.md)

**v1.4 — CLI & template polish**
- [ ] CLI back-navigation between prompt steps
- [ ] TanStack Shadcn-only layout (no MUI dependency)
- [ ] Next.js Pages Router full port

**v1.5 — State manager flexibility**
- [ ] Zustand option (swap files per framework)
- [ ] Jotai option
- [ ] Astro full dashboard port

**v2.0 — Modular assembly architecture**
- [ ] Shared-core + per-axis swap file model (replaces per-framework template trees)
- [ ] `npx create-terakota` on npm registry
- [ ] Interactive browser-based template configurator

---

## About Terakota & Intacata

[Terakota](https://terakota.live) is a full-spectrum React dashboard platform developed by [Intacata](https://intacata.com). It provides advanced theming, data layers, enterprise auth, and premium components on top of the Foundation scaffold.

| Layer | Description | Access |
|---|---|---|
| **Foundation** | Open-source scaffold CLI | Free · This repo |
| **Terakota Lite** | Freemium — PWA, Electron, premium components | Free tier + paid |
| **Terakota** | Full commercial platform | Commercial |

Foundation is part of the `terakota-lite` repository to reflect its position in the product hierarchy — open-source, community-first, and the entry point into the wider Terakota ecosystem.

---

## License

MIT © [Intacata](https://intacata.com) — see [LICENSE](LICENSE) for full terms.

---

<div align="center">

*Built with care by the Intacata team · [terakota.live](https://terakota.live) · [intacata.com](https://intacata.com)*

</div>
