# Contributing to Terakota Foundation

Thank you for your interest in contributing. Foundation is the open-source scaffold layer of [Terakota](https://terakota.live) by [Intacata](https://intacata.com), and community contributions help make it better for everyone.

---

## Before You Start

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) fully — it explains how the scaffold system works, the capability matrix, template structure, and critical rules for editing template files.
2. Check [open issues](https://github.com/intacata-org/terakota-lite/issues) to see if the problem or feature is already being discussed.
3. For large changes, open an issue first to discuss the approach before writing code.

---

## Types of Contributions

| Type | Where | Notes |
|---|---|---|
| Bug fix | CLI source, templates | Include reproduction steps in the PR |
| New framework template | `packages/templates/` | Must pass all items in the Testing Checklist |
| New styling option | `scaffold.ts` + template | Must work for at least 2 framework templates |
| Documentation | `docs/`, `README.md` | Corrections, clarifications, translations |
| Compatibility fix | `scaffold.ts`, templates | Include environment details |

---

## Development Setup

```bash
git clone https://github.com/intacata-org/terakota-lite.git
cd terakota-lite
git checkout foundation
```

No root `npm install` is needed for development — the CLI is a compiled single-file bundle.

### Editing CLI source

```bash
# Edit TypeScript source
code packages/create-terakota/src/

# Rebuild the CLI bundle after changes
cd packages/create-terakota
npx esbuild src/index.ts \
  --bundle --platform=node --target=node18 --format=cjs \
  --outfile=dist/index.cjs \
  --define:'import.meta.url=__importMetaUrl' \
  '--banner:js=#!/usr/bin/env node
const __importMetaUrl = require("url").pathToFileURL(__filename).href;'
```

### Testing your changes

```bash
# From the repo root
node create.js TestProject

# In the generated project
cd TestProject
npm install
npm run dev
```

---

## Testing Checklist

Every PR that touches templates or CLI must pass these checks:

- [ ] `node create.js TestProject` completes without error
- [ ] `npm install` succeeds (or with `--legacy-peer-deps`)
- [ ] `npm run dev` starts without terminal errors
- [ ] Browser: page renders (not blank, no crash)
- [ ] Browser: no console errors beyond known SW favicon warning
- [ ] Dark / light mode toggle works
- [ ] Sidebar open/close and mini-mode work
- [ ] RTL toggle works (if i18n selected)
- [ ] Navigation to `/settings`, `/theme-studio`, `/widgets` works
- [ ] Layout variant switch works at runtime

Run tests against at minimum: **Vite + MUI + Tailwind** and the framework you changed.

---

## Critical Rules for Template Editing

> These rules exist because template files are used both as runnable source AND as scaffold input. Violating them causes silent, hard-to-debug corruption.

### Rule 1 — No literal `\n` in template files
The `str_replace` tool can corrupt files by writing the literal two-character sequence `\n` instead of a real newline. After any template edit, verify:

```bash
grep -rn "\\\\n" packages/templates/foundation-vite-tailwind/src/
# Should return nothing
```

### Rule 2 — No bare `/* */` comments in JSX element position
This is invalid TypeScript/JSX:
```tsx
// ❌ WRONG — causes Vite parse error
<Routes>
  /*@if:widgets*/
  <Route path="/widgets" element={<Widgets />} />
  /*@endif:widgets*/
</Routes>
```

Use JSX comment syntax or conditional arrays instead:
```tsx
// ✅ CORRECT
const extraRoutes = /*@if:widgets*/[<Route key="w" path="/widgets" element={<Widgets />} />]/*@endif:widgets*/;
```

### Rule 3 — `devDeps` must be declared before use in `scaffold.ts`
The `generatePackageJson` function builds deps top-to-bottom. Any assignment to `devDeps[x]` must come after `const devDeps = {...}`.

### Rule 4 — The capability matrix is the contract
If a template does not genuinely support an option, remove it from that framework's entry in the `CAPABILITIES` object in `src/index.ts`. Do not leave broken options that silently do nothing.

---

## Code Style

- TypeScript for all CLI source (`src/`)
- Template files use TypeScript by default (JS output is generated at scaffold time by renaming)
- 4-space indentation
- Single quotes for strings
- No trailing commas in TypeScript (templates only)

---

## Pull Request Process

1. Fork the repository and create a branch: `git checkout -b fix/tanstack-blank-page`
2. Make your changes following the rules above
3. Rebuild the CLI bundle if you edited `src/`
4. Run the Testing Checklist
5. Commit with a clear message: `fix: tanstack index route was duplicating __root`
6. Push and open a PR against the `foundation` branch (not `main`)
7. Fill in the PR template — include what you changed and how you tested it

---

## Questions

Open a [Discussion](https://github.com/intacata-org/terakota-lite/discussions) for general questions. Use [Issues](https://github.com/intacata-org/terakota-lite/issues) for bugs and feature requests.
