#!/usr/bin/env node
/**
 * Terakota Foundation — Bootstrap Script
 *
 * Run once after cloning/unzipping:
 *   node scripts/setup.js
 *
 * What it does:
 *   1. Checks Node version (>= 18 required)
 *   2. Installs CLI dependencies
 *   3. Builds the CLI
 *   4. Optionally launches the interactive project creator
 */

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CLI_DIR = join(ROOT, 'packages', 'create-terakota');
const CLI_DIST = join(CLI_DIR, 'dist', 'index.js');

// ── Colours ──────────────────────────────────────────────────────────────────
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

const ok  = (s) => console.log(`  ${c.green}✔${c.reset}  ${s}`);
const info = (s) => console.log(`  ${c.blue}ℹ${c.reset}  ${s}`);
const warn = (s) => console.log(`  ${c.yellow}⚠${c.reset}  ${s}`);
const err  = (s) => console.log(`  ${c.red}✖${c.reset}  ${s}`);
const step = (s) => console.log(`\n  ${c.bold}${c.cyan}→${c.reset}  ${c.bold}${s}${c.reset}`);

// ── Banner ────────────────────────────────────────────────────────────────────
console.log(`
${c.bold}${c.blue}  ╔══════════════════════════════════════════════════╗
  ║         TERAKOTA FOUNDATION — SETUP             ║
  ╚══════════════════════════════════════════════════╝${c.reset}
`);

// ── 1. Node version check ─────────────────────────────────────────────────────
step('Checking Node.js version');
const nodeVersion = process.versions.node;
const [major] = nodeVersion.split('.').map(Number);
if (major < 18) {
    err(`Node.js 18+ required. You have v${nodeVersion}.`);
    info('Install Node 18 via nvm:  nvm install 18 && nvm use 18');
    info('Or download from:        https://nodejs.org');
    process.exit(1);
}
ok(`Node.js v${nodeVersion} ✓`);

// ── 2. Install CLI dependencies ───────────────────────────────────────────────
step('Installing CLI dependencies');
if (!existsSync(join(CLI_DIR, 'node_modules'))) {
    try {
        info('Running npm install in packages/create-terakota...');
        execSync('npm install', { cwd: CLI_DIR, stdio: 'inherit' });
        ok('Dependencies installed');
    } catch {
        err('npm install failed. Check your internet connection and try again.');
        process.exit(1);
    }
} else {
    ok('Dependencies already installed (skipping)');
}

// ── 3. Build CLI ──────────────────────────────────────────────────────────────
step('Building CLI');
if (!existsSync(CLI_DIST)) {
    try {
        info('Compiling TypeScript...');
        execSync('npx tsup', { cwd: CLI_DIR, stdio: 'pipe' });
        ok('CLI built → packages/create-terakota/dist/index.js');
    } catch (e) {
        err('CLI build failed:');
        console.error(e.message);
        process.exit(1);
    }
} else {
    ok('CLI already built (skipping). Run npm run build:cli to rebuild.');
}

// ── 4. Done — show usage ──────────────────────────────────────────────────────
console.log(`
  ${c.bold}${c.green}✔ Setup complete!${c.reset}

  ${c.bold}Create a new project:${c.reset}

    ${c.cyan}npm run create${c.reset}                       ${c.dim}# interactive — asks all questions${c.reset}
    ${c.cyan}npm run create MyApp${c.reset}                 ${c.dim}# pre-fills project name${c.reset}
    ${c.cyan}node packages/create-terakota/dist/index.js${c.reset}  ${c.dim}# direct${c.reset}

  ${c.bold}Or run the CLI directly from anywhere:${c.reset}

    ${c.cyan}node ${join('packages', 'create-terakota', 'dist', 'index.js')} MyApp${c.reset}

  ${c.dim}─────────────────────────────────────────────────────${c.reset}
  ${c.dim}Docs:  https://foundation.terakota.live${c.reset}
`);

// ── Ask if they want to create a project now ──────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question(`  ${c.bold}Create a project now?${c.reset} [Y/n] `, (answer) => {
    rl.close();
    if (answer.toLowerCase() !== 'n') {
        console.log();
        const child = spawn('node', [CLI_DIST], { stdio: 'inherit' });
        child.on('exit', (code) => process.exit(code ?? 0));
    } else {
        console.log(`\n  ${c.dim}Run ${c.reset}${c.cyan}npm run create${c.reset}${c.dim} when you're ready.${c.reset}\n`);
        process.exit(0);
    }
});
