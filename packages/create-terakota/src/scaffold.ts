import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import type { FoundationConfig, TemplateKey } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Template resolver ────────────────────────────────────────────────────────
function resolveTemplateKey(config: FoundationConfig): TemplateKey {
    const { framework, styling } = config;

    // CRA
    if (framework === 'cra') return 'foundation-cra';

    // Astro
    if (framework === 'astro') return 'foundation-astro';

    // TanStack
    if (framework === 'tanstack') return 'foundation-tanstack';

    // Next.js — both App Router and Pages Router use the same full-dashboard template
    // (Pages Router support via adapter pattern will be added in a future iteration)
    if (framework === 'next-app' || framework === 'next-pages') {
        return 'foundation-next-app';
    }

    // Vite variants
    if (styling === 'mui-tailwind') return 'foundation-vite-tailwind';
    if (styling === 'mui-shadcn')   return 'foundation-vite-shadcn';   // falls back to vite-tailwind
    if (styling === 'shadcn')       return 'foundation-vite-shadcn';
    if (styling === 'tailwind')     return 'foundation-vite-tailwind';  // use tailwind template, strip MUI in post-process
    if (styling === 'bootstrap-mui') return 'foundation-vite';          // base vite + bootstrap deps added
    if (styling === 'css-modules')  return 'foundation-vite';           // base vite, no extra CSS lib
    return 'foundation-vite';
}

// ─── String replacements applied to every text file ──────────────────────────
function getReplacements(config: FoundationConfig) {
    const layoutVariantValue = config.frame;

    return [
        // Project naming
        { from: /TERAKOTA_FOUNDATION_NAME/g,  to: config.projectName },
        { from: /terakota-foundation-name/g,  to: config.projectName.toLowerCase().replace(/\s+/g, '-') },
        { from: /TerakotaFoundationName/g,    to: toPascalCase(config.projectName) },

        // Layout variant — sets initial Redux state in sidebarSlice
        { from: /TERAKOTA_LAYOUT_VARIANT/g,   to: layoutVariantValue },

        // Conditional blocks
        { from: /\/\*\s*@if:electron\s*\*\/([\s\S]*?)\/\*\s*@endif:electron\s*\*\//g,
          to: (config.desktop === 'electron' || config.desktop === 'electron-only') ? '$1' : '' },
        { from: /\/\*\s*@if:pwa\s*\*\/([\s\S]*?)\/\*\s*@endif:pwa\s*\*\//g,
          to: (config.desktop === 'pwa' || config.desktop === 'electron') ? '$1' : '' },
        { from: /\/\*\s*@if:i18n\s*\*\/([\s\S]*?)\/\*\s*@endif:i18n\s*\*\//g,
          to: config.features.includes('i18n') ? '$1' : '' },
        { from: /\/\*\s*@if:widgets\s*\*\/([\s\S]*?)\/\*\s*@endif:widgets\s*\*\//g,
          to: config.features.includes('widgets') ? '$1' : '' },
        { from: /\/\*\s*@if:storybook\s*\*\/([\s\S]*?)\/\*\s*@endif:storybook\s*\*\//g,
          to: config.features.includes('storybook') ? '$1' : '' },
        { from: /\/\*\s*@if:pwa-ctx\s*\*\/([\s\S]*?)\/\*\s*@endif:pwa-ctx\s*\*\//g,
          to: config.features.includes('pwa-ctx') ? '$1' : '' },
    ];
}

function toPascalCase(str: string) {
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c?.toUpperCase() ?? '');
}

// ─── File renaming for JS variant ─────────────────────────────────────────────
function renameForLanguage(filePath: string, language: 'typescript' | 'javascript'): string {
    if (language === 'javascript') {
        return filePath
            .replace(/\.tsx$/, '.jsx')
            .replace(/\.ts$/, '.js')
            .replace(/tsconfig\.json/, 'jsconfig.json');
    }
    return filePath;
}

// ─── Files to exclude based on config ─────────────────────────────────────────
function shouldExclude(relPath: string, config: FoundationConfig): boolean {
    const { desktop, features } = config;

    if ((desktop === 'web' || desktop === 'pwa') && relPath.startsWith('electron/')) return true;
    if (!features.includes('storybook') && (relPath.startsWith('.storybook/') || relPath.includes('.stories.'))) return true;
    if (!features.includes('tour') && relPath.includes('/tour/')) return true;
    if (!features.includes('analytics') && relPath.includes('reportWebVitals')) return true;
    if (!features.includes('pwa-ctx') && relPath.includes('/pwa/')) return true;

    return false;
}

// ─── Package.json generator ────────────────────────────────────────────────────
function generatePackageJson(config: FoundationConfig): object {
    const { projectName, framework, desktop, styling, features, language } = config;

    const deps: Record<string, string> = {
        '@emotion/is-prop-valid': '^1.4.0',
        '@emotion/react': '^11.11.1',
        '@emotion/styled': '^11.11.0',
        '@fontsource/dm-sans': '^5.0.21',
        '@fontsource/inter': '^5.0.20',
        '@fontsource/poppins': '^5.0.14',
        '@fontsource/roboto': '^5.0.14',
        '@iconify/react': '^4.0.1',
        'framer-motion': '^11.0.0',
        'react': framework === 'tanstack' || framework === 'cra' ? '^18.3.0' : '^19',
        'react-dom': framework === 'tanstack' || framework === 'cra' ? '^18.3.0' : '^19',
        'styled-components': '^6',
        'usehooks-ts': '^3.1.0',
    };

    // MUI — TanStack uses MUI 6 (esbuild 0.18/Catalina-compatible).
    // MUI 7's new ESM subpath format requires esbuild 0.19+. MUI 6 works with esbuild 0.18.
    // Vite/CRA/Next use MUI 7 unless styling is pure Tailwind/Shadcn/CSS-modules.
    const isTanStack = framework === 'tanstack';
    const isCRA = framework === 'cra';
    const alwaysMui = isTanStack || isCRA;
    if (alwaysMui || !['tailwind', 'shadcn', 'css-modules'].includes(styling)) {
        const muiVersion = isTanStack ? '^6.4.0' : '^7';
        const muiLabVersion = isTanStack ? '^6.0.0-beta' : '^7.0.0-beta';
        Object.assign(deps, {
            '@mui/icons-material': muiVersion,
            '@mui/lab': muiLabVersion,
            '@mui/material': muiVersion,
            '@mui/system': muiVersion,
        });
    }

    // Bootstrap
    if (styling === 'bootstrap-mui') {
        deps['bootstrap'] = '^5.3.0';
        deps['react-bootstrap'] = '^2.10.0';
    }

    // State management — all full-dashboard templates use Redux.
    // The CLI capability matrix ensures stateManager is always 'redux' for full templates.
    deps['@reduxjs/toolkit'] = '^2.3.0';
    deps['react-redux'] = '^9.0.0';

    // i18n — TanStack main.tsx always imports it; others include it when feature selected
    if (features.includes('i18n') || isTanStack) {
        deps['i18next'] = '^23.6.0';
        deps['react-i18next'] = '^13.3.1';
    }

    // Router
    if (framework === 'vite' || isCRA) {
        deps['react-router-dom'] = '^6.21.0';
    }

    // PWA progress bar
    if (desktop === 'pwa' || desktop === 'electron') {
        deps['nprogress'] = '^0.2.0';
    }

    // Storybook features
    if (features.includes('storybook')) {
        deps['@storybook/react'] = '^8.0.0';
        deps['@storybook/react-webpack5'] = '^8.0.0';
    }

    // Tour
    if (features.includes('tour')) {
        deps['react-joyride'] = '^2.9.0';
    }

    const devDeps: Record<string, string> = {
        '@types/node': '^22',
        '@types/react': '^19',
        '@types/react-dom': '^19',
        'eslint': '^9.0.0',
        'eslint-plugin-react-hooks': '^4.6.0',
        'eslint-plugin-react-refresh': '^0.4.5',
        'prettier': '^3.2.5',
    };

    // Tailwind CSS — build tools belong in devDependencies
    if (['mui-tailwind', 'mui-shadcn', 'shadcn', 'tailwind'].includes(styling)) {
        devDeps['tailwindcss']  = '^3.4.0';
        devDeps['postcss']      = '^8.4.0';
        devDeps['autoprefixer'] = '^10.4.0';
    }

    if (language === 'typescript') {
        devDeps['typescript'] = '^5.5.0';
        devDeps['@types/styled-components'] = '^5.1.34';
        if (deps['nprogress']) devDeps['@types/nprogress'] = '^0.2.3';
    }

    // Build tool deps
    let buildToolDeps: Record<string, string> = {};
    const port = 3009;
    let buildScripts: Record<string, string> = {};

    if (framework === 'vite') {
        buildToolDeps = {
            '@vitejs/plugin-react': '^4.3.4',
            // Vite 4.5.3 uses esbuild 0.18 internally — Catalina (macOS 10.15) compatible.
            // Do NOT pin esbuild separately: vite 4 already bundles the right version and
            // adding it as an explicit dep causes npm peer-resolution conflicts.
            'vite': '^4.5.3',
            ...(desktop !== 'web' && desktop !== 'electron-only' ? { 'vite-plugin-pwa': '^0.21.0' } : {}),
            ...(desktop === 'electron' || desktop === 'electron-only' ? {
                'concurrently': '^9.0.0',
                'electron': '^28.0.0',
                'electron-builder': '^24.0.0',
                'electron-is-dev': '^3.0.0',
                'wait-on': '^7.0.0',
            } : {}),
        };
        buildScripts = {
            'dev': 'vite --port 3009',
            'build': language === 'typescript' ? 'tsc -b && vite build' : 'vite build',
            'preview': 'vite preview',
            'lint': `eslint . --ext ${language === 'typescript' ? 'ts,tsx' : 'js,jsx'} --report-unused-disable-directives`,
            ...(language === 'typescript' ? { 'typecheck': 'tsc --noEmit' } : {}),
            ...(desktop === 'electron' || desktop === 'electron-only' ? {
                'dev:electron': 'concurrently "vite" "wait-on http://localhost:3009 && electron ."',
                'build:electron': `${language === 'typescript' ? 'tsc -b && ' : ''}vite build && electron-builder`,
            } : {}),
            ...(features.includes('storybook') ? {
                'storybook': 'storybook dev -p 6006',
                'build-storybook': 'storybook build',
            } : {}),
        };
    } else if (framework === 'cra') {
        buildToolDeps = { 'react-scripts': '5', 'react-app-rewired': '^2.2.1' };
        buildScripts = {
            'start': 'cross-env GENERATE_SOURCEMAP=false PORT=3009 react-app-rewired start',
            'build': 'react-scripts build',
            'test': 'react-scripts test',
            'eject': 'react-scripts eject',
        };
        devDeps['cross-env'] = '^7.0.3';
    } else if (framework === 'astro') {
        buildToolDeps = { 'astro': '^4.0.0', '@astrojs/react': '^3.0.0', '@astrojs/tailwind': '^5.0.0' };
        buildScripts = { 'dev': 'astro dev', 'build': 'astro build', 'preview': 'astro preview' };
    } else if (framework === 'tanstack') {
        // TanStack Router SPA mode — pinned to versions that work with Vite 4.5 (esbuild 0.18).
        // @tanstack/react-router 1.50.x is the last range confirmed compatible with Vite 4.
        deps['@tanstack/react-router']         = '^1.50.0';
        devDeps['@tanstack/router-vite-plugin'] = '^1.50.0';
        devDeps['@vitejs/plugin-react']        = '^4.3.0';
        devDeps['vite']                        = '^4.5.3';
        devDeps['vite-tsconfig-paths']         = '^5.1.0';
        buildScripts = { 'dev': 'vite --port 3009', 'build': 'vite build', 'preview': 'vite preview' };
    } else if (framework === 'next-app' || framework === 'next-pages') {
        buildToolDeps = {
            'next': '^14.2.0',
        };
        // Tailwind is already handled in devDeps above for mui-tailwind styling.
        // Add Next.js specific devDeps.
        devDeps['@types/node'] = '^22';
        buildScripts = {
            'postinstall': 'node scripts/postinstall.js',
            'dev': 'next dev -p 3009',
            'build': 'next build',
            'start': 'next start -p 3009',
            'lint': 'next lint',
        };
        // Next.js specific runtime deps (no @mui/material-nextjs needed — we use direct ThemeProvider)
        deps['next'] = '^14.2.0';
        // WASM SWC fallback — required on macOS 10.15 Catalina where the native
        // @next/swc-darwin-x64 binary truncates during download and crashes on dlopen.
        // Next.js automatically uses this when the native binary is absent (ENOENT = catchable,
        // unlike the dlopen crash from a corrupted binary). See scripts/postinstall.js.
        devDeps['@next/swc-wasm-nodejs'] = '^14.2.0';
    }

    // ── Force esbuild 0.18.x only for TanStack ────────────────────────────────
    // macOS 10.15 Catalina requires esbuild ≤ 0.18. @tanstack/router-vite-plugin
    // pulls in newer esbuild as a transitive dep; npm `overrides` pins the whole tree.
    // Vite template does NOT use overrides — MUI 7 ESM needs esbuild 0.19+ and Vite's
    // own bundled esbuild 0.18 is sufficient for Catalina without overrides.
    const overrides = framework === 'tanstack'
        ? { esbuild: '0.18.20' }
        : undefined;

    return {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '0.1.0',
        private: true,
        description: `A Terakota Foundation project — ${framework} + ${styling}`,
        ...(framework === 'vite' || framework === 'astro' || framework === 'tanstack' ? { type: 'module' } : {}),
        scripts: buildScripts,
        dependencies: deps,
        devDependencies: { ...devDeps, ...buildToolDeps },
        ...(overrides ? { overrides } : {}),
        engines: { node: '>=18.0.0' },
    };
}

// ─── Main scaffold function ────────────────────────────────────────────────────
export async function createProject(config: FoundationConfig, cliDir: string): Promise<void> {
    const { targetDir, language } = config;
    const templateKey = resolveTemplateKey(config);
    const templateDir = resolveTemplateDir(templateKey, cliDir);

    await fs.ensureDir(targetDir);
    await copyAndTransform(templateDir, targetDir, config);

    const generatedPkg = generatePackageJson(config);
    await fs.writeJson(path.join(targetDir, 'package.json'), generatedPkg, { spaces: 4 });

    await writeEnvExample(targetDir, config);
    await writeGitignore(targetDir, config);
    await writeReadme(targetDir, config);

    // Write .npmrc — legacy-peer-deps prevents npm 11's strict peer checks from
    // failing on React 19 + MUI 7 + emotion combinations that still declare React 18 peers.
    await fs.writeFile(
        path.join(targetDir, '.npmrc'),
        'legacy-peer-deps=true\n',
        'utf-8'
    );

    // Always write postcss.config.cjs with correct CJS syntax.
    // (.cjs extension forces CommonJS loader — must use module.exports, NOT export default)
    if (['mui-tailwind', 'mui-shadcn', 'shadcn', 'tailwind'].includes(config.styling)) {
        await fs.writeFile(
            path.join(targetDir, 'postcss.config.cjs'),
            `module.exports = {\n    plugins: {\n        tailwindcss: {},\n        autoprefixer: {},\n    },\n};\n`,
            'utf-8'
        );
    }

    // Remove Electron files if not needed
    if (config.desktop !== 'electron' && config.desktop !== 'electron-only') {
        await fs.remove(path.join(targetDir, 'electron'));
    }

    // Remove i18n if not selected
    if (!config.features.includes('i18n')) {
        await fs.remove(path.join(targetDir, 'src', 'i18n'));
    }
}

// ─── Template directory resolution ────────────────────────────────────────────
function resolveTemplateDir(templateKey: TemplateKey, cliDir: string): string {
    const distRelative = path.resolve(cliDir, '..', 'templates', templateKey);
    if (fs.pathExistsSync(distRelative)) return distRelative;

    const monoRelative = path.resolve(cliDir, '..', '..', 'templates', templateKey);
    if (fs.pathExistsSync(monoRelative)) return monoRelative;

    // Graceful fallbacks for variants not yet built
    const fallbacks: Record<string, string> = {
        'foundation-cra': 'foundation-vite',
        'foundation-astro': 'foundation-vite',
        'foundation-vite-shadcn': 'foundation-vite-tailwind',
        'foundation-vite-tailwind-only': 'foundation-vite-tailwind',
        'foundation-vite-bootstrap': 'foundation-vite',
        'foundation-vite-css-modules': 'foundation-vite',
        'foundation-next-app-tailwind': 'foundation-next-app',
        'foundation-next-pages': 'foundation-next-app',
    };

    const fallbackKey = fallbacks[templateKey];
    if (fallbackKey) {
        const fallbackDist = path.resolve(cliDir, '..', 'templates', fallbackKey);
        if (fs.pathExistsSync(fallbackDist)) {
            console.warn(`\n  ⚠  Template "${templateKey}" not yet built — using "${fallbackKey}" as base\n`);
            return fallbackDist;
        }
        const fallbackMono = path.resolve(cliDir, '..', '..', 'templates', fallbackKey);
        if (fs.pathExistsSync(fallbackMono)) {
            console.warn(`\n  ⚠  Template "${templateKey}" not yet built — using "${fallbackKey}" as base\n`);
            return fallbackMono;
        }
    }

    const viteFallback = path.resolve(cliDir, '..', '..', 'templates', 'foundation-vite');
    if (fs.pathExistsSync(viteFallback)) {
        console.warn(`\n  ⚠  Template "${templateKey}" not found — using foundation-vite as fallback\n`);
        return viteFallback;
    }

    throw new Error(`Template directory not found for "${templateKey}"`);
}

// ─── File copy + transformation ───────────────────────────────────────────────
async function copyAndTransform(src: string, dest: string, config: FoundationConfig): Promise<void> {
    const replacements = getReplacements(config);

    await fs.copy(src, dest, {
        filter: (srcPath) => {
            const rel = path.relative(src, srcPath);
            if (rel === '') return true;
            if (rel.startsWith('node_modules')) return false;
            if (rel === 'package.json') return false;
            if (rel === '.gitignore') return false;
            if (rel === '.env.example') return false;
            if (rel === 'README.md') return false;
            if (shouldExclude(rel, config)) return false;
            return true;
        },
        overwrite: true,
    });

    const allFiles = await getAllFiles(dest);
    for (const filePath of allFiles) {
        const ext = path.extname(filePath);
        const isText = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', '.md', '.yaml', '.yml', '.env', '.toml', '.cjs', '.mjs'].includes(ext);

        if (isText) {
            let content = await fs.readFile(filePath, 'utf-8');
            for (const { from, to } of replacements) {
                content = content.replace(from, to as string);
            }
            await fs.writeFile(filePath, content, 'utf-8');
        }

        const newPath = renameForLanguage(filePath, config.language);
        if (newPath !== filePath) {
            await fs.move(filePath, newPath, { overwrite: true });
        }
    }
}

async function getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) files.push(...await getAllFiles(fullPath));
        else files.push(fullPath);
    }
    return files;
}

// ─── .env.example ─────────────────────────────────────────────────────────────
async function writeEnvExample(targetDir: string, config: FoundationConfig): Promise<void> {
    const prefix = config.framework.startsWith('next') ? '' : 'VITE_';
    const lines = [
        `# ${config.projectName} — Environment Variables`,
        `# Copy to .env.local and fill in your values`,
        '',
        `# Platform`,
        `${prefix}PLATFORM=${config.desktop}`,
        `${prefix}APP_NAME=${config.projectName}`,
        `${prefix}APP_VERSION=0.1.0`,
        '',
        `# API`,
        `${prefix}API_BASE_URL=http://localhost:4000/api/v1`,
        '',
        `# Auth — configure your auth provider`,
        `# CLERK_PUBLISHABLE_KEY=pk_test_...   (Clerk)`,
        `# NEXTAUTH_SECRET=...                 (NextAuth)`,
        '',
        `# AI — NEVER expose secret keys on the client`,
        `# ANTHROPIC_API_KEY=sk-ant-...   (backend only)`,
        `# OPENAI_API_KEY=sk-...          (backend only)`,
    ];
    await fs.writeFile(path.join(targetDir, '.env.example'), lines.join('\n') + '\n', 'utf-8');
}

// ─── .gitignore ────────────────────────────────────────────────────────────────
async function writeGitignore(targetDir: string, config: FoundationConfig): Promise<void> {
    const lines = [
        '# Dependencies', 'node_modules', '',
        '# Build outputs', 'dist', '.next', 'out', '',
        '# Env', '.env', '.env.local', '.env.*.local', '',
        '# Logs', '*.log', 'yarn-error.log', '',
        '# Editor', '.DS_Store', '.vscode/*', '!.vscode/extensions.json', '.idea', '',
        '# Misc', 'coverage', 'storybook-static',
        ...(config.desktop === 'electron' || config.desktop === 'electron-only' ? ['', '# Electron builds', 'release'] : []),
    ];
    await fs.writeFile(path.join(targetDir, '.gitignore'), lines.join('\n') + '\n', 'utf-8');
}

// ─── README.md ─────────────────────────────────────────────────────────────────
async function writeReadme(targetDir: string, config: FoundationConfig): Promise<void> {
    const { projectName, framework, desktop, styling, frame, stateManager, packageManager, features } = config;
    const pm = packageManager;
    const devCmd = framework === 'cra' ? 'start' : 'dev';
    const electronSection = (desktop === 'electron' || desktop === 'electron-only')
        ? `\n### Desktop (Electron)\n\`\`\`bash\n${pm} run dev:electron\n\`\`\`` : '';

    const content = `# ${projectName}

> Built with **Terakota Foundation** — ${framework} · ${styling} · ${frame}

## Getting started

\`\`\`bash
${pm} install
${pm} run ${devCmd}
\`\`\`
${electronSection}

## Stack

| Layer | Choice |
|-------|--------|
| Framework | ${framework} |
| Platform | ${desktop} |
| Styling | ${styling} |
| Layout | ${frame} |
| State | ${stateManager} |
| Language | ${config.language} |
| Features | ${features.join(', ') || 'core only'} |

## Layout variant

This project uses the **\`${frame}\`** layout.  
To switch layouts at runtime: dispatch \`setLayoutVariant('sidebar-vertical')\` from any component.

## Project structure

\`\`\`
src/
├── app/           # App root, providers
├── routes/        # Route definitions
├── layouts/       # DashboardLayout + variants
├── pages/         # Route-level page components
├── features/      # Redux slices (theme, sidebar)
├── components/    # Reusable UI components
├── utils/         # Helper functions
├── i18n/          # Translations (if enabled)
└── styles/        # Global CSS
\`\`\`

---
*Scaffolded by [create-terakota](https://foundation.terakota.live)*
`;
    await fs.writeFile(path.join(targetDir, 'README.md'), content, 'utf-8');
}
