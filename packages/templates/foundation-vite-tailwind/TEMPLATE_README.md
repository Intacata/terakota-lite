# Terakota Foundation

> **Minimal. Production-ready. Immediately buildable.**

Terakota Foundation is the distilled, CRA-free base template for all Terakota-derived projects — including **DashBuds**. It retains 100% of Terakota's essential patterns (theme engine, Redux layout, i18n, PWA, Electron path) while stripping away every page, widget, and feature that doesn't belong in a seed project.

---

## Stack

| Layer          | Technology                                        |
|----------------|---------------------------------------------------|
| Build tool     | **Vite 6** (replaces CRA / react-scripts)        |
| Framework      | React 19 + TypeScript 5                           |
| UI Library     | MUI 7 (same as Terakota)                         |
| Styling        | Emotion (via MUI) + styled-components 6           |
| State          | Redux Toolkit 2 + react-redux 9                   |
| Routing        | React Router **v6** (upgraded from v5)            |
| i18n           | i18next + react-i18next (LTR & RTL)              |
| Desktop        | Electron 28 (optional, `.cjs` main process)       |
| PWA            | vite-plugin-pwa + Workbox (auto service worker)   |
| Fonts          | @fontsource/* (Inter, Roboto, Poppins, DM Sans)   |

---

## Quick Start

```bash
# 1. Install
yarn install   # or: npm install / pnpm install

# 2. Run web dev server
yarn dev

# 3. Run as Electron desktop app (optional)
yarn dev:electron

# 4. Build for web (PWA)
yarn build

# 5. Build as Electron desktop app (optional)
yarn build:electron
```

Open [http://localhost:3009](http://localhost:3009)

---

## Key Differences from Origin Terakota (CRA)

| Topic | Terakota (CRA) | Foundation (Vite) |
|---|---|---|
| Build tool | react-scripts / webpack | Vite 6 |
| Entry point | `public/index.html` + `src/index.tsx` | `index.html` (root) + `src/main.tsx` |
| Router | React Router v5 `<HashRouter>` | React Router **v6** `<BrowserRouter>` |
| Routing API | `<Switch>` + `component={}` | `<Routes>` + `element={}` |
| Navigation | `useHistory()` | `useNavigate()` |
| Lazy loading | `React.lazy` (manual) | `lazy()` via page registry in `AppContainer` |
| Electron | Separate CJS entry | `electron/main.cjs` + `electron/preload.cjs` |
| Path aliases | `~/foo` via tsconfig | Same aliases, resolved by Vite |

---

## Directory Structure

```
terakota-foundation/
├── index.html                  # Vite entry (was public/index.html in CRA)
├── vite.config.ts              # Vite + PWA config
├── tsconfig.json               # TypeScript (bundler mode)
├── electron/
│   ├── main.cjs                # Electron main process
│   └── preload.cjs             # Context bridge (IPC)
└── src/
    ├── main.tsx                # React root (was index.tsx)
    ├── App.tsx                 # Theme + Router shell
    ├── routes/
    │   └── index.tsx           # All routes + lazy-load config
    ├── layouts/
    │   ├── AppContainer.tsx    # Page registry + DashboardLayout wrapper
    │   └── DashboardLayout/    # Header + Sidebar + main content
    ├── features/
    │   ├── theme/              # themeSlice + themeUtils (MUI theme factory)
    │   └── sidebar/            # sidebarSlice (nav state)
    ├── pages/                  # Landing, Login, Home, Settings, errors...
    ├── store/                  # Redux store
    ├── i18n/                   # i18next config + en/ar locales
    ├── utils/                  # faviconUtils, etc.
    └── styles/                 # Global CSS (index.css)
```

---

## Porting Components from Terakota

Path aliases are identical (`~/components/Foo` etc.) so most components
paste across without import changes. The two things to update:

1. **Router hooks**: `useHistory` → `useNavigate`, `useRouteMatch` → `useMatch`
2. **Route syntax**: `<Route path="/" component={X}>` → `<Route path="/" element={<X />}>`

---

## Building DashBuds on this Foundation

Add these packages to start the DashBuds feature layer:

```bash
yarn add react-grid-layout apexcharts react-apexcharts
yarn add @types/react-grid-layout
```

Then:
1. Create `src/pages/dashboards/` for dashboard list and viewer pages
2. Add routes in `src/routes/index.tsx`
3. Add menu items in `src/features/sidebar/sidebarSlice.ts`
4. Create `src/features/dashboard/dashboardSlice.ts` for dashboard state

---

## Foundation Variants (Planned)

| Variant | Status |
|---|---|
| `foundation-vite` (this file) | ✅ Available |
| `foundation-next-app` (Next.js App Router) | 🔜 Planned |
| `foundation-next-pages` (Next.js Pages Router) | 🔜 Planned |
| `foundation-vite-tailwind` (MUI + Tailwind) | 🔜 Planned |
| `foundation-vite-js` (JavaScript) | 🔜 Planned |

---

*Terakota Foundation — © 2025 NG0-GabrielOnike*
