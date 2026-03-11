# Release Notes — v1.3.6

**Released:** March 2025  
**Tag:** `foundation-v1.3.6`  
**Status:** ✅ Latest stable

## Summary

Completes the Catalina SWC fix. Next.js loads SWC from two separate places — v1.3.5 blocked the transpiler load, this release blocks the minifier load.

## Root cause

When `babel.config.js` is present, Next.js uses Babel for **transpilation** and logs `Disabled SWC as replacement for Babel`. The app starts successfully (`✓ Ready`). But Next.js 14 defaults to `swcMinify: true` — it loads the SWC binary a second time specifically for **minification**, independently of the Babel config. On Catalina that second load crashes the first page compile with `Failed to load SWC binary`.

## Fix

Added `swcMinify: false` to `next.config.js`. Next.js falls back to Terser for minification. Both SWC load points are now fully bypassed on Catalina:

| SWC use | Fix |
|---|---|
| Transpilation | `babel.config.js` with `next/babel` preset (v1.3.5) |
| Minification | `swcMinify: false` in `next.config.js` (v1.3.6) |

## Trade-off

Terser is slower than SWC for production builds. On macOS 11+ you can remove both `babel.config.js` and the `swcMinify: false` line to re-enable full SWC performance.
