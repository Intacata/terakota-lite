// ─── Framework ────────────────────────────────────────────────────────────────
export type Framework =
    | 'vite'          // Vite 6 + React 19 (recommended)
    | 'cra'           // Create React App (legacy, Webpack)
    | 'next-app'      // Next.js App Router (RSC + SSR)
    | 'next-pages'    // Next.js Pages Router (classic)
    | 'astro'         // Astro (MPA / content-heavy)
    | 'tanstack';     // TanStack Start (type-safe full-stack, experimental)

// ─── Platform / Desktop ───────────────────────────────────────────────────────
export type Desktop =
    | 'web'           // Web only — no service worker, no Electron
    | 'pwa'           // Web + PWA (service worker, installable)
    | 'electron'      // Web + PWA + Electron (desktop app)
    | 'electron-only'; // Electron only — no PWA service worker

// ─── Styling ─────────────────────────────────────────────────────────────────
export type Styling =
    | 'mui'               // MUI 7 only
    | 'mui-tailwind'      // MUI 7 + Tailwind CSS
    | 'mui-shadcn'        // MUI 7 + Shadcn/ui + Tailwind
    | 'shadcn'            // Shadcn/ui + Tailwind (no MUI)
    | 'tailwind'          // Tailwind CSS only (no component library)
    | 'bootstrap-mui'     // Bootstrap 5 + MUI 7 (Terakota legacy style)
    | 'css-modules';      // CSS Modules / Vanilla CSS (no utility framework)

// ─── Language ─────────────────────────────────────────────────────────────────
export type Language = 'typescript' | 'javascript';

// ─── App Frame Layout ─────────────────────────────────────────────────────────
export type Frame =
    | 'sidebar-vertical'        // Classic left sidebar + TopBar (mini-mode included)
    | 'sidebar-vertical-right'  // Left sidebar + TopBar + Right panel
    | 'sidebar-horizontal'      // Horizontal top navigation (no left sidebar)
    | 'sidebar-horizontal-right'// Horizontal top nav + Right panel
    | 'sidebar-dual'            // Left sidebar + persistent Right panel (both always visible)
    | 'minimal'                 // Header only — clean, content-first
    | 'minimal-right'           // Header + Right panel only
    | 'tabbed';                 // Tab-bar navigation (IDE / browser style)

// ─── State Management ─────────────────────────────────────────────────────────
export type StateManager =
    | 'redux'     // Redux Toolkit (RTK) — recommended, matches Terakota
    | 'zustand'   // Zustand — lightweight, minimal boilerplate
    | 'jotai'     // Jotai — atomic state
    | 'context';  // React Context + useReducer only (no external lib)

// ─── Optional Features ────────────────────────────────────────────────────────
export type Feature =
    | 'i18n'       // i18next + RTL support
    | 'widgets'    // Widget / Dashboard system (DynamicWidgetRegistry)
    | 'auth'       // Auth pages: Login, Register, Lock
    | 'theme'      // Dark / Light / System theme toggle
    | 'toast'      // Toast notification system
    | 'pwa-ctx'    // PWA Context + install prompt hooks (from Terakota)
    | 'storybook'  // Storybook component explorer
    | 'tour'       // Guided tour (react-joyride)
    | 'analytics'; // Web Vitals + analytics

// ─── Package Manager ──────────────────────────────────────────────────────────
export type PackageManager = 'npm' | 'yarn' | 'pnpm';

// ─── Foundation Config ────────────────────────────────────────────────────────
export interface FoundationConfig {
    projectName: string;
    targetDir: string;
    framework: Framework;
    desktop: Desktop;
    styling: Styling;
    language: Language;
    frame: Frame;
    stateManager: StateManager;
    features: Feature[];
    packageManager: PackageManager;
    installDeps: boolean;
    initGit: boolean;
}

// ─── Template Key ─────────────────────────────────────────────────────────────
export type TemplateKey =
    | 'foundation-vite'
    | 'foundation-vite-tailwind'
    | 'foundation-vite-shadcn'
    | 'foundation-vite-tailwind-only'
    | 'foundation-vite-bootstrap'
    | 'foundation-vite-css-modules'
    | 'foundation-cra'
    | 'foundation-astro'
    | 'foundation-next-app'
    | 'foundation-next-app-tailwind'
    | 'foundation-next-pages'
    | 'foundation-tanstack';
