# Release Notes — v1.3.5

**Released:** March 2025  
**Tag:** `foundation-v1.3.5`  
**Status:** ✅ Latest stable

## Summary

Permanent fix for the `truncated mach-o` / `Failed to load SWC binary` crash on macOS 10.15 Catalina. Adds `babel.config.js` to the Next.js template to force Babel compilation instead of SWC.

## Why this crash happens

Every version of Next.js 13+ ships a precompiled SWC native binary (`@next/swc-darwin-x64`). That binary is built targeting macOS 11+ (Big Sur). On Catalina (macOS 10.15) the OS rejects the binary with a `truncated mach-o` error — the binary references memory segments beyond what Catalina can map.

## The fix

Next.js automatically disables SWC and falls back to Babel when it detects a `babel.config.js` file in the project root. The `next/babel` preset is bundled inside Next.js itself — no extra packages to install.

```js
// babel.config.js (added to Next.js template)
module.exports = { presets: ['next/babel'] };
```

## Trade-off

Babel is slower than SWC for large projects (~2-3x compile time). On macOS 11+ you can delete `babel.config.js` to re-enable SWC. For Catalina users this is the only working option.
