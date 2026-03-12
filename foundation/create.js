#!/usr/bin/env node
/**
 * Terakota Foundation — Project Scaffolder
 *
 * Usage:
 *   node create.js              → interactive prompts
 *   node create.js MyApp        → pre-fill project name
 *   node create.js --help       → show CLI options
 *
 * Requires: Node.js 18+
 * No npm install needed — the CLI is fully bundled.
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';

const ROOT    = dirname(fileURLToPath(import.meta.url));
const CLI_DIR = join(ROOT, 'packages', 'create-terakota');
const CLI_BIN = join(CLI_DIR, 'dist', 'index.cjs');

// ─── ANSI helpers ─────────────────────────────────────────────────────────────
const b = '\x1b[1m', d = '\x1b[2m', r = '\x1b[0m';
const green = '\x1b[32m', blue = '\x1b[34m', cyan = '\x1b[36m', red = '\x1b[31m';
const ok   = (s) => console.log(`  ${green}✔${r}  ${s}`);
const fail = (s) => { console.error(`\n  ${red}✖  ${s}${r}\n`); process.exit(1); };

// ─── Banner ───────────────────────────────────────────────────────────────────
console.log(`
${b}${blue}  ████████╗███████╗██████╗  █████╗ ██╗  ██╗ ██████╗ ████████╗ █████╗ ${r}
${b}${blue}     ██║   ██╔════╝██╔══██╗██╔══██╗██║ ██╔╝██╔═══██╗╚══██╔══╝██╔══██╗${r}
${b}${blue}     ██║   █████╗  ██████╔╝███████║█████╔╝ ██║   ██║   ██║   ███████║${r}
${b}${blue}     ██║   ██╔══╝  ██╔══██╗██╔══██║██╔═██╗ ██║   ██║   ██║   ██╔══██║${r}
${b}${blue}     ██║   ███████╗██║  ██║██║  ██║██║  ██╗╚██████╔╝   ██║   ██║  ██║${r}
${d}     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝${r}

  ${b}F O U N D A T I O N${r}  ${d}v1.1.0 — Multi-framework. Multi-variant. Instantly buildable.${r}
  ${d}─────────────────────────────────────────────────────────────────────────${r}
`);

// ─── Node version check ───────────────────────────────────────────────────────
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
    fail(`Node.js 18+ required (you have v${process.versions.node}).\n     Fix: nvm install 20 && nvm use 20`);
}
ok(`Node.js v${process.versions.node}`);

// ─── Bundle check — rebuild only if missing ───────────────────────────────────
// The dist/index.cjs is a fully self-contained bundle (no node_modules needed).
// It only needs to be rebuilt if the file is absent (e.g. fresh clone).
if (!existsSync(CLI_BIN)) {
    console.log(`\n  ${cyan}›${r}  CLI bundle not found — rebuilding (one-time, ~5s)...\n`);
    try {
        // Install deps into create-terakota only (needed for esbuild)
        execSync('npm install --silent', { cwd: CLI_DIR, stdio: 'pipe' });

        // Build a fully self-contained bundle — all deps inlined, no external requires
        const esbuild = join(CLI_DIR, 'node_modules', '.bin', 'esbuild');
        execSync(
            `"${esbuild}" src/index.ts --bundle --platform=node --target=node18 --format=cjs --outfile=dist/index.cjs`,
            { cwd: CLI_DIR, stdio: 'pipe' }
        );

        // Patch import.meta.url for CJS compat
        const { readFileSync, writeFileSync } = await import('fs');
        const shim = `#!/usr/bin/env node\nconst __importMetaUrl = require('url').pathToFileURL(__filename).href;\n`;
        let content = readFileSync(CLI_BIN, 'utf8');
        if (content.startsWith('#!/usr/bin/env node\n')) content = content.slice(20);
        writeFileSync(CLI_BIN, shim + content);

        ok('CLI bundle built successfully');
    } catch (e) {
        fail(
            `CLI bundle missing and rebuild failed.\n` +
            `  Expected: ${CLI_BIN}\n\n` +
            `  Manual fix:\n` +
            `    cd packages/create-terakota\n` +
            `    npm install\n` +
            `    npx esbuild src/index.ts --bundle --platform=node --target=node18 --format=cjs --outfile=dist/index.cjs`
        );
    }
} else {
    ok('CLI ready');
}

// ─── Launch ───────────────────────────────────────────────────────────────────
console.log();
const child = spawn(process.execPath, [CLI_BIN, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env },
});
child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (err) => fail(`Failed to launch CLI: ${err.message}`));
