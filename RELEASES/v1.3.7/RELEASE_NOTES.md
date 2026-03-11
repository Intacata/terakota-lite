# Release Notes — v1.3.7

**Released:** March 2025  
**Tag:** `foundation-v1.3.7`  
**Status:** ✅ Latest stable

## Summary

Root cause fix for the SWC crash on macOS Catalina. Previous versions patched around the symptoms; this release addresses why it crashes.

## Root cause

`@next/swc-darwin-x64` is a 100MB+ native binary. On macOS 10.15, npm's download truncates consistently (producing 3–110MB corrupted files). When Node.js calls `dlopen()` on the truncated file, macOS throws an OS-level error. This is not a JavaScript exception — it is not catchable, and it terminates the process. `babel.config.js` and `swcMinify: false` only disabled two usage points. The binary was still being loaded for React Server Component compilation.

## Fix — three layers

| Layer | File | What it does |
|---|---|---|
| 1 | `scripts/postinstall.js` | Deletes `@next/swc-darwin-x64` after install. `dlopen` crash → catchable `ENOENT` |
| 2 | `package.json` devDep | `@next/swc-wasm-nodejs` — WebAssembly SWC, works everywhere, ~15MB, always downloads cleanly |
| 3 | `babel.config.js` + `swcMinify: false` | Minimises how often Next.js reaches for SWC at all |

## Expected startup log after this fix

```
✓ Starting...
  Disabled SWC as replacement for Babel (babel.config.js)
⚠ Attempted to load @next/swc-darwin-x64... (file not found — postinstall deleted it)
  Using @next/swc-wasm-nodejs as fallback
✓ Ready in ~240s
○ Compiling /home ...
✓ Compiled /home   ← no crash here
```
