# Terakota Foundation — Releases

This directory is the canonical version archive for Foundation. Every published release lives here as a self-contained installable archive.

---

## How to install any version

```bash
# Download the zip for the version you want from GitHub Releases, then:
unzip Terakota-Foundation-v1.3.2.zip -d Terakota-Foundation
cd Terakota-Foundation
node create.js MyApp
cd MyApp && npm install && npm run dev
```

Or install directly from a git tag:
```bash
git clone https://github.com/intacata-org/terakota-lite.git
cd terakota-lite
git checkout foundation
git checkout tags/foundation-v1.3.2
node create.js MyApp
```

---

## Release Index

| Version | Date | Status | Summary | Download |
|---|---|---|---|---|
| [v1.3.7](v1.3.7/RELEASE_NOTES.md) | 2025-03 | ✅ Latest | Root cause SWC fix: postinstall deletes truncated binary, WASM fallback | [GitHub Release](https://github.com/Intacata/terakota-lite/releases/tag/foundation-v1.3.7) |
| [v1.3.6](v1.3.6/RELEASE_NOTES.md) | 2025-03 | ✅ Latest | swcMinify: false — completes Catalina SWC fix | [GitHub Release](https://github.com/Intacata/terakota-lite/releases/tag/foundation-v1.3.6) |
| [v1.3.5](v1.3.5/RELEASE_NOTES.md) | 2025-03 | ✅ Latest | Babel fallback — fixes SWC crash on macOS Catalina | [GitHub Release](https://github.com/Intacata/terakota-lite/releases/tag/foundation-v1.3.5) |
| [v1.3.4](v1.3.4/RELEASE_NOTES.md) | 2025-03 | ✅ Latest | next.config.js fix, i18n init, use client fixes | [GitHub Release](https://github.com/Intacata/terakota-lite/releases/tag/foundation-v1.3.4) |
| [v1.3.3](v1.3.3/RELEASE_NOTES.md) | 2025-03 | ✅ Latest | Gitignore fix — CLI bundle now tracked by git | [GitHub Release](https://github.com/Intacata/terakota-lite/releases/tag/foundation-v1.3.3) |
| [v1.3.2](v1.3.2/RELEASE_NOTES.md) | 2025-03 | ✅ Latest | Next.js router fix, Next.js 14 for Catalina | [GitHub Release](https://github.com/intacata-org/terakota-lite/releases/tag/foundation-v1.3.2) |
| [v1.3.1](v1.3.1/RELEASE_NOTES.md) | 2025-03 | Superseded | TanStack blank page fix, Next.js full dashboard port | [GitHub Release](https://github.com/intacata-org/terakota-lite/releases/tag/foundation-v1.3.1) |
| [v1.3.0](v1.3.0/RELEASE_NOTES.md) | 2025-03 | Superseded | Capability matrix, honest CLI options | [GitHub Release](https://github.com/intacata-org/terakota-lite/releases/tag/foundation-v1.3.0) |
| [v1.2.4](v1.2.4/RELEASE_NOTES.md) | 2025-Q1 | Archived | First confirmed stable Vite release | [GitHub Release](https://github.com/intacata-org/terakota-lite/releases/tag/foundation-v1.2.4) |

---

## Version Naming Convention

```
MAJOR.MINOR.PATCH[-qualifier]
   │     │     │       └── optional: alpha, beta, rc1
   │     │     └── Bug fixes, compatibility patches
   │     └── New frameworks, new feature options, new templates  
   └── Breaking changes to generated project structure or CLI contract
```

### Sub-combination versioning

As Foundation grows to support more framework × styling × state manager combinations, individual combinations may have their own patch-level stability tracking. The format extends naturally:

```
1.4.0          — Full release (all tested combinations)
1.4.0-vite     — Vite-specific hotfix within the 1.4.0 base
1.4.0-tanstack — TanStack-specific hotfix
1.4.1          — Rolled up patch (includes all sub-combination fixes)
```

Sub-combination releases are published as pre-release tags and not added to the main release index until they are rolled into a numbered patch.

---

## Release Lifecycle

```
Development  →  Alpha  →  Beta  →  Release Candidate  →  Stable
   main           X.Y.Z-alpha    X.Y.Z-beta    X.Y.Z-rc1        X.Y.Z
```

| Stage | Tag format | GitHub Release type | Who should use it |
|---|---|---|---|
| Alpha | `foundation-v1.4.0-alpha` | Pre-release | Contributors only |
| Beta | `foundation-v1.4.0-beta` | Pre-release | Early adopters |
| Release Candidate | `foundation-v1.4.0-rc1` | Pre-release | Testers |
| Stable | `foundation-v1.4.0` | Full release | Everyone |

---

## How a Release Is Created

### Automated (GitHub Actions)

Pushing a tag triggers the release pipeline automatically:

```bash
# 1. Update CHANGELOG.md with the new version entry
# 2. Bump version in package.json
# 3. Commit the changes
git add CHANGELOG.md package.json
git commit -m "chore: release v1.3.2"

# 4. Tag the release
git tag foundation-v1.3.2

# 5. Push — the release workflow creates the zip and GitHub Release automatically
git push origin foundation
git push origin foundation-v1.3.2
```

The [release workflow](../.github/workflows/release.yml) will:
- Create `Terakota-Foundation-v1.3.2.zip` 
- Publish it as a GitHub Release with the CHANGELOG entry as release notes
- Mark it as pre-release if the tag contains `alpha`, `beta`, or `rc`

### Manual (local)

```bash
cd /path/to/foundation-branch
zip -r Terakota-Foundation-v1.3.2.zip . \
  --exclude "*/node_modules/*" --exclude "*/.git/*" \
  --exclude "*/dist/*" --exclude "*.zip" -q
zip Terakota-Foundation-v1.3.2.zip packages/create-terakota/dist/index.cjs -q
```

---

## Archive Contents

Each release zip contains:

```
Terakota-Foundation-vX.Y.Z/
├── create.js                          ← Run this to scaffold
├── packages/
│   ├── create-terakota/
│   │   ├── src/                       ← TypeScript source
│   │   └── dist/index.cjs             ← Compiled CLI (no build step needed)
│   └── templates/                     ← All framework templates
├── docs/                              ← Full documentation
├── RELEASES/                          ← This directory
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── README.md
├── SECURITY.md
└── llms.txt
```

`node_modules/` is NOT included. Dependencies are installed inside each generated project, not at the repo root.
