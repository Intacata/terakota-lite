# Release Notes — v1.3.0

**Released:** March 2025  
**Tag:** `foundation-v1.3.0`  
**Status:** Superseded  
**Branch:** `foundation`

---

## Summary

Architecture overhaul. Introduced the `CAPABILITIES` matrix — the CLI now only shows options that the template actually supports. Removed fake Zustand/Jotai choices. First version with `ARCHITECTURE.md`.

---

## What changed

### Added
- `CAPABILITIES` object in CLI — per-framework map of supported stylingOptions, platforms, etc.
- Framework labels in CLI now state "Full dashboard" vs "Basic starter".
- `ARCHITECTURE.md` — technical reference.

### Changed
- State manager prompt removed. All full-dashboard templates use Redux. CLI states this clearly.
- TanStack description: "MUI 6 + Redux (fixed stack)".

### Fixed
- Vite: removed `overrides.esbuild` that was incorrectly copied from TanStack v1.2.7 fix.
- TanStack: Redux and i18n deps always included regardless of CLI selections.

---

## Checkpoint significance

Good conceptual baseline. Marks the shift from "options that might work" to "options that are real".
