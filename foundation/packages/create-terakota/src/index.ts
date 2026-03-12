import { program } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import { createProject } from './scaffold.js';
import { validateProjectName } from './utils.js';
import { TERAKOTA_BANNER, DONE_BANNER } from './banner.js';
import type { FoundationConfig } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Capability matrix ────────────────────────────────────────────────────────
// Defines what each framework template actually supports.
// CLI only shows options that are real — no fake choices that silently do nothing.
const CAPABILITIES = {
    vite: {
        fullDashboard: true,
        stateManagers: ['redux'],
        stylingOptions: ['mui', 'mui-tailwind', 'mui-shadcn', 'shadcn', 'tailwind', 'bootstrap-mui', 'css-modules'],
        platforms: ['pwa', 'electron', 'electron-only', 'web'],
        notes: null,
    },
    tanstack: {
        fullDashboard: true,
        stateManagers: ['redux'],
        stylingOptions: ['mui', 'mui-tailwind', 'shadcn'],  // MUI 6-based; shadcn+tailwind also works
        platforms: ['web', 'pwa'],
        notes: 'MUI 6 + Redux (fixed stack). Layout, features & language are flexible.',
    },
    cra: {
        fullDashboard: true,
        stateManagers: ['redux'],
        stylingOptions: ['mui', 'mui-tailwind'],
        platforms: ['web'],
        notes: 'Legacy webpack stack. Full dashboard with MUI + Redux.',
    },
    'next-app': {
        fullDashboard: true,
        stateManagers: ['redux'],
        stylingOptions: ['mui', 'mui-tailwind'],
        platforms: ['web', 'pwa'],
        notes: 'App Router (RSC). Full dashboard — MUI 7 + Redux.',
    },
    'next-pages': {
        fullDashboard: true,
        stateManagers: ['redux'],
        stylingOptions: ['mui', 'mui-tailwind'],
        platforms: ['web', 'pwa'],
        notes: 'Pages Router (classic). Full dashboard — MUI 7 + Redux.',
    },
    astro: {
        fullDashboard: false,
        stateManagers: ['redux'],
        stylingOptions: ['tailwind'],
        platforms: ['web'],
        notes: 'Basic starter template. Full dashboard coming in a future release.',
    },
} as const;

// ─── CLI definition ───────────────────────────────────────────────────────────
program
    .name('create-terakota')
    .description('Create a new Terakota Foundation project')
    .version('1.2.0')
    .argument('[project-name]', 'Name of the project to create')
    .option('-t, --template <template>', 'Template to use (skips prompts)')
    .option('--no-install', 'Skip package installation')
    .option('--no-git', 'Skip git initialization')
    .action(async (projectNameArg, opts) => {
        console.log(TERAKOTA_BANNER);

        // ── 1. Project name ──────────────────────────────────────────────────
        let projectName = projectNameArg;
        if (!projectName) {
            const res = await prompts({
                type: 'text',
                name: 'projectName',
                message: 'What is your project name?',
                initial: 'my-terakota-app',
                validate: validateProjectName,
            }, { onCancel: () => process.exit(0) });
            projectName = res.projectName;
        } else {
            const err = validateProjectName(projectName);
            if (typeof err === 'string') { console.error(chalk.red(`✖ ${err}`)); process.exit(1); }
        }

        const targetDir = path.resolve(process.cwd(), projectName);
        if (await fs.pathExists(targetDir)) {
            const res = await prompts({
                type: 'confirm',
                name: 'overwrite',
                message: `Directory ${chalk.cyan(projectName)} already exists. Overwrite?`,
                initial: false,
            }, { onCancel: () => process.exit(0) });
            if (!res.overwrite) process.exit(0);
            await fs.emptyDir(targetDir);
        }

        // ── 2. Framework ─────────────────────────────────────────────────────
        const frameworkRes = await prompts({
            type: 'select',
            name: 'framework',
            message: 'Choose a framework:',
            choices: [
                { title: `${chalk.yellow('⚡')} Vite               ${chalk.dim('— Full dashboard: MUI 7 + Redux. PWA/Electron ready')}`, value: 'vite' },
                { title: `${chalk.gray('◈')} TanStack Router     ${chalk.dim('— Full dashboard: MUI 6 + Redux. Type-safe SPA routing')}`, value: 'tanstack' },
                { title: `${chalk.cyan('⚛')} CRA                 ${chalk.dim('— Full dashboard: MUI 7 + Redux. Webpack (legacy)')}`, value: 'cra' },
                { title: `${chalk.blue('▲')} Next.js App Router  ${chalk.dim('— Full dashboard: MUI 7 + Redux. RSC + SSR')}`, value: 'next-app' },
                { title: `${chalk.blue('▲')} Next.js Pages Router${chalk.dim('— Full dashboard: MUI 7 + Redux. Classic Next.js')}`, value: 'next-pages' },
                { title: `${chalk.magenta('🚀')} Astro               ${chalk.dim('— Basic starter. Full dashboard coming soon')}`, value: 'astro' },
            ],
            initial: 0,
        }, { onCancel: () => process.exit(0) });

        const framework = frameworkRes.framework as keyof typeof CAPABILITIES;
        const caps = CAPABILITIES[framework];

        if (caps.notes) {
            console.log(chalk.dim(`\n  ℹ  ${caps.notes}\n`));
        }
        if (!caps.fullDashboard) {
            console.log(chalk.yellow(`  ⚠  This is a basic starter template — not a full dashboard.\n`));
        }

        // ── 3. Platform ─────────────────────────────────────────────────────
        const allPlatformChoices = [
            { title: `${chalk.green('🌐')} Web + PWA            ${chalk.dim('— Installable PWA, service worker, offline ready')}`, value: 'pwa' },
            { title: `${chalk.cyan('🖥')}  Web + PWA + Electron  ${chalk.dim('— Full cross-platform: browser + desktop app')}`, value: 'electron' },
            { title: `${chalk.cyan('💻')} Electron Only         ${chalk.dim('— Desktop app only, no service worker/PWA')}`, value: 'electron-only' },
            { title: `${chalk.dim('○')}  Web Only              ${chalk.dim('— Plain web app, no PWA or Electron')}`, value: 'web' },
        ];
        const platformChoices = allPlatformChoices.filter(c => caps.platforms.includes(c.value as any));

        const desktopRes = await prompts({
            type: 'select',
            name: 'desktop',
            message: 'Target platform:',
            choices: platformChoices,
            initial: 0,
        }, { onCancel: () => process.exit(0) });

        // ── 4. Styling ───────────────────────────────────────────────────────
        const allStylingChoices = [
            { title: `MUI 7                    ${chalk.dim('— Material UI components, Emotion, themed')}`, value: 'mui' },
            { title: `MUI 7 + Tailwind CSS     ${chalk.dim('— MUI layout + Tailwind utility classes')}`, value: 'mui-tailwind' },
            { title: `MUI 7 + Shadcn + Tailwind${chalk.dim('— MUI + headless Shadcn components + Tailwind')}`, value: 'mui-shadcn' },
            { title: `Shadcn/ui + Tailwind     ${chalk.dim('— Headless Shadcn components + Tailwind only')}`, value: 'shadcn' },
            { title: `Tailwind CSS Only        ${chalk.dim('— Pure Tailwind, no component library')}`, value: 'tailwind' },
            { title: `Bootstrap 5 + MUI 7      ${chalk.dim('— Bootstrap grid + MUI components')}`, value: 'bootstrap-mui' },
            { title: `CSS Modules / Vanilla    ${chalk.dim('— Scoped CSS modules, no utility framework')}`, value: 'css-modules' },
            { title: `MUI 6                    ${chalk.dim('— Material UI v6, Emotion, themed (Catalina-safe)')}`, value: 'mui6' },
            { title: `MUI 6 + Tailwind CSS     ${chalk.dim('— MUI v6 + Tailwind utility classes (Catalina-safe)')}`, value: 'mui6-tailwind' },
        ];

        // Map tanstack-specific labels
        const stylingChoices = allStylingChoices
            .filter(c => caps.stylingOptions.includes(c.value as any))
            .map(c => {
                if (framework === 'tanstack') {
                    // TanStack uses MUI 6, relabel to be clear
                    if (c.value === 'mui') return { ...c, title: `MUI 6                    ${chalk.dim('— Material UI v6, Emotion, themed')}` };
                    if (c.value === 'mui-tailwind') return { ...c, title: `MUI 6 + Tailwind CSS     ${chalk.dim('— MUI v6 + Tailwind utility classes')}` };
                }
                return c;
            });

        const stylingRes = await prompts({
            type: 'select',
            name: 'styling',
            message: 'Styling approach:',
            choices: stylingChoices,
            initial: 0,
        }, { onCancel: () => process.exit(0) });

        // ── 5. Language ──────────────────────────────────────────────────────
        const langRes = await prompts({
            type: 'select',
            name: 'language',
            message: 'Language:',
            choices: [
                { title: `TypeScript ${chalk.dim('(recommended)')}`, value: 'typescript' },
                { title: 'JavaScript', value: 'javascript' },
            ],
            initial: 0,
        }, { onCancel: () => process.exit(0) });

        // ── 6. App frame layout ──────────────────────────────────────────────
        const frameRes = await prompts({
            type: 'select',
            name: 'frame',
            message: 'App frame layout:',
            choices: [
                { title: `Vertical Sidebar              ${chalk.dim('— Left sidebar + TopBar (collapsible/mini-mode)')}`, value: 'sidebar-vertical' },
                { title: `Vertical Sidebar + Right Panel${chalk.dim('— Left sidebar + TopBar + right info/tools panel')}`, value: 'sidebar-vertical-right' },
                { title: `Horizontal (Top) Navigation   ${chalk.dim('— Full-width top nav bar only, no left sidebar')}`, value: 'sidebar-horizontal' },
                { title: `Horizontal Nav + Right Panel  ${chalk.dim('— Top nav + collapsible right panel')}`, value: 'sidebar-horizontal-right' },
                { title: `Dual Panel                    ${chalk.dim('— Left sidebar + persistent right panel')}`, value: 'sidebar-dual' },
                { title: `Minimal                       ${chalk.dim('— Clean header only, content takes full width')}`, value: 'minimal' },
                { title: `Minimal + Right Panel         ${chalk.dim('— Simple header + slide-in right panel')}`, value: 'minimal-right' },
                { title: `Tabbed                        ${chalk.dim('— IDE/browser-style tab bar navigation')}`, value: 'tabbed' },
            ],
            initial: 0,
        }, { onCancel: () => process.exit(0) });

        // ── 7. State management ──────────────────────────────────────────────
        // All full-dashboard templates are built on Redux.
        // The CLI is honest: Redux is the only option offered for templates where
        // source code is Redux-based. Zustand/Jotai variants are a future roadmap item.
        console.log(chalk.dim(`  State management: ${chalk.white('Redux Toolkit')} ${chalk.dim('(all full dashboard templates use Redux)')}`));
        const stateManager = 'redux';

        // ── 8. Optional features ─────────────────────────────────────────────
        const featuresRes = await prompts({
            type: 'multiselect',
            name: 'features',
            message: 'Optional features (space to select, enter to confirm):',
            choices: [
                { title: 'i18n / RTL support',                  value: 'i18n',       selected: true },
                { title: 'Widget / Dashboard system',           value: 'widgets',    selected: true },
                { title: 'Auth pages (Login, Register, Lock)',  value: 'auth',       selected: true },
                { title: 'Dark / Light / System theme toggle',  value: 'theme',      selected: true },
                { title: 'Toast notification system',           value: 'toast',      selected: true },
                { title: 'Web Vitals / Analytics',              value: 'analytics',  selected: false },
                ...(caps.fullDashboard && framework !== 'tanstack' ? [
                    { title: 'PWA Context + install prompt', value: 'pwa-ctx',   selected: false },
                    { title: 'Storybook component explorer', value: 'storybook', selected: false },
                    { title: 'Guided tour (react-joyride)',  value: 'tour',      selected: false },
                ] : []),
            ],
            hint: '— Space to select, Enter to confirm',
        }, { onCancel: () => process.exit(0) });

        // ── 9. Package manager ───────────────────────────────────────────────
        const pmRes = await prompts({
            type: 'select',
            name: 'pm',
            message: 'Package manager:',
            choices: [
                { title: 'npm',  value: 'npm' },
                { title: 'pnpm', value: 'pnpm' },
                { title: 'yarn', value: 'yarn' },
            ],
            initial: 0,
        }, { onCancel: () => process.exit(0) });

        // ── 10. Assemble config ──────────────────────────────────────────────
        const config: FoundationConfig = {
            projectName,
            targetDir,
            framework: frameworkRes.framework,
            desktop: desktopRes.desktop,
            styling: stylingRes.styling,
            language: langRes.language,
            frame: frameRes.frame,
            stateManager,
            features: featuresRes.features ?? [],
            packageManager: pmRes.pm,
            installDeps: opts.install !== false,
            initGit: opts.git !== false,
        };

        // ── 11. Summary ──────────────────────────────────────────────────────
        console.log();
        console.log(chalk.bold('  Your Terakota Foundation project:'));
        console.log();
        console.log(`  ${chalk.dim('Name')}          ${chalk.cyan(config.projectName)}`);
        console.log(`  ${chalk.dim('Framework')}     ${chalk.yellow(config.framework)}${!caps.fullDashboard ? chalk.dim(' (basic starter)') : ''}`);
        console.log(`  ${chalk.dim('Platform')}      ${chalk.yellow(config.desktop)}`);
        console.log(`  ${chalk.dim('Styling')}       ${chalk.yellow(config.styling)}`);
        console.log(`  ${chalk.dim('Language')}      ${chalk.yellow(config.language)}`);
        console.log(`  ${chalk.dim('Layout')}        ${chalk.yellow(config.frame)}`);
        console.log(`  ${chalk.dim('State mgr')}     ${chalk.yellow(config.stateManager)}`);
        console.log(`  ${chalk.dim('Features')}      ${chalk.yellow(config.features.join(', ') || 'none')}`);
        console.log(`  ${chalk.dim('Package mgr')}   ${chalk.yellow(config.packageManager)}`);
        console.log();

        const confirmRes = await prompts({
            type: 'confirm',
            name: 'ok',
            message: 'Looks good — scaffold now?',
            initial: true,
        }, { onCancel: () => process.exit(0) });

        if (!confirmRes.ok) { console.log(chalk.yellow('\n  Cancelled.')); process.exit(0); }

        // ── 12. Scaffold ─────────────────────────────────────────────────────
        const scaffoldSpinner = ora('Scaffolding project files...').start();
        try {
            await createProject(config, __dirname);
            scaffoldSpinner.succeed('Project files created');
        } catch (err) {
            scaffoldSpinner.fail('Scaffolding failed');
            console.error(err);
            process.exit(1);
        }

        // ── 13. Git init ──────────────────────────────────────────────────────
        if (config.initGit) {
            const gitSpinner = ora('Initialising git repository...').start();
            try {
                await execa('git', ['init'], { cwd: targetDir });
                await execa('git', ['add', '-A'], { cwd: targetDir });
                await execa('git', ['commit', '-m', 'feat: initial commit from create-terakota'], { cwd: targetDir });
                gitSpinner.succeed('Git repository initialised');
            } catch {
                gitSpinner.warn('Git init skipped (git not found or error)');
            }
        }

        // ── 14. Install deps ──────────────────────────────────────────────────
        if (config.installDeps) {
            const pm = config.packageManager;
            const installSpinner = ora(`Installing dependencies with ${pm}... (this may take a minute)`).start();
            try {
                const installArgs = pm === 'npm'
                    ? ['install', '--legacy-peer-deps']
                    : ['install'];
                await execa(pm, installArgs, {
                    cwd: targetDir,
                    stdio: 'pipe',
                    shell: true,
                    timeout: 300_000,
                });
                installSpinner.succeed(`Dependencies installed`);
            } catch (installErr: any) {
                const raw = (installErr?.stderr || installErr?.message || '') as string;
                const lines = raw.split('\n').filter((l: string) => l.includes('error') || l.includes('Error') || l.includes('ERR'));
                const hint = lines.slice(0, 5).join('\n') || raw.slice(0, 400);
                installSpinner.warn(`Dependency installation failed — run \`${pm} install\` in the project folder`);
                if (hint) process.stderr.write('\n  ► ' + hint.trim() + '\n');
            }
        }

        // ── 15. Done! ─────────────────────────────────────────────────────────
        console.log(DONE_BANNER(config));
    });

program.parse();
