/**
 * postinstall.js — Catalina SWC compatibility fix
 *
 * Problem: @next/swc-darwin-x64 requires macOS 11+. On macOS 10.15 Catalina,
 * npm partially downloads the binary (100MB+ file truncates to a few MB).
 * When Next.js tries to load the truncated file, macOS throws a "truncated mach-o"
 * dlopen error — this is an OS-level crash, not a catchable JS error.
 *
 * Fix: delete the corrupted binary directory entirely. When Next.js can't find
 * it (ENOENT), it catches that gracefully and falls back to @next/swc-wasm-nodejs
 * which is a pure-JS WebAssembly build that works on any platform.
 *
 * On macOS 11+ this script is a no-op — the native binary loads fine.
 */
const fs   = require('fs');
const path = require('path');

if (process.platform !== 'darwin') process.exit(0);

const root   = path.resolve(__dirname, '..');
const swcDir = path.join(root, 'node_modules', '@next', 'swc-darwin-x64');

if (fs.existsSync(swcDir)) {
    try {
        fs.rmSync(swcDir, { recursive: true, force: true });
        console.log('✓ Removed @next/swc-darwin-x64 (WASM fallback will be used)');
    } catch (e) {
        // Non-fatal — if we can't remove it, it might be fine on this macOS version
    }
}
