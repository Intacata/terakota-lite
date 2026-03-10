# Versions & Release Management

This document explains how Foundation versions work, how to install a specific version, and how releases are structured.

---

## Version Format

Foundation uses [Semantic Versioning](https://semver.org): `MAJOR.MINOR.PATCH`

| Segment | Changes when |
|---|---|
| `MAJOR` | Breaking changes to CLI interface or generated project structure |
| `MINOR` | New frameworks, new styling options, new feature additions |
| `PATCH` | Bug fixes, compatibility fixes, documentation updates |

Git tags on the `foundation` branch follow the format: `foundation-v1.3.1`

---

## Current Release

| Version | Status | Release date |
|---|---|---|
| **1.3.1** | ✅ Latest stable | 2025 Q1 |
| 1.3.0 | Superseded | 2025 Q1 |
| 1.2.4 | Archived (last pre-TanStack) | 2025 Q1 |
| < 1.2 | Unsupported | — |

---

## Installing a Specific Version

### From GitHub releases (recommended)

Every version is archived as a downloadable zip on the [Releases page](https://github.com/intacata-org/terakota-lite/releases).

```bash
# Download and extract the specific version you want
unzip Terakota-Foundation-v1.3.1.zip -d Terakota-Foundation
cd Terakota-Foundation
node create.js MyApp
```

### From a git tag

```bash
git clone https://github.com/intacata-org/terakota-lite.git
cd terakota-lite
git checkout tags/foundation-v1.3.1

node create.js MyApp
```

### Stay on the latest

```bash
# If you already have the repo cloned:
git checkout foundation
git pull origin foundation
node create.js MyApp
```

---

## Key Checkpoint Versions

These versions mark significant milestones and are worth keeping as reference points.

### v1.2.4 — First confirmed stable Vite release
**Why it matters:** This is the version where the Vite PWA template (MUI 7 + Tailwind) was confirmed fully working end-to-end for the first time. All earlier versions had installation or runtime bugs. If you need the simplest, most tested baseline, this is a solid reference.

**What works:** Vite + MUI 7 + Tailwind + all features

**What was broken:** TanStack (blank page), Next.js (4-file stub only)

### v1.3.0 — Architecture overhaul
**Why it matters:** Introduced the `CAPABILITIES` capability matrix — the CLI now only shows options that the template actually supports. Removed fake Zustand/Jotai choices that would silently do nothing. Also the first version with `ARCHITECTURE.md`.

**What changed:** CLI is now honest. No broken options shown. State manager prompt removed.

### v1.3.1 — TanStack + Next.js full dashboards
**Why it matters:** TanStack blank page fixed. Next.js upgraded from a 4-file stub to a full dashboard (complete source tree ported). Both Next.js router variants added. Shadcn option added for TanStack. The first version where Vite, TanStack, and Next.js all offer full dashboards.

---

## Changelog

Full entry-by-entry history: [CHANGELOG.md](../CHANGELOG.md)

---

## How Releases Are Created

When a version is ready for release:

1. `CHANGELOG.md` is updated with the new version entry
2. `package.json` version is bumped
3. The commit is tagged: `git tag foundation-v1.3.1`
4. Pushing the tag triggers the [Release workflow](../.github/workflows/release.yml), which automatically:
   - Creates a `Terakota-Foundation-vX.X.X.zip` archive
   - Publishes it as a GitHub Release with the CHANGELOG entry as release notes

### Archive contents

The release archive contains the complete Foundation source, excluding `node_modules`, `.git`, and any local build artifacts. The compiled CLI bundle (`packages/create-terakota/dist/index.cjs`) is **included** so no build step is needed.

---

## Support Policy

| Version | Support status |
|---|---|
| 1.3.x (current) | ✅ Active — bug fixes and improvements |
| 1.2.x | ⚠️ Critical security fixes only |
| 1.1.x and earlier | ❌ End of life |
