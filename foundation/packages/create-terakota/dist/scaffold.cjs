#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/scaffold.ts
var scaffold_exports = {};
__export(scaffold_exports, {
  createProject: () => createProject
});
module.exports = __toCommonJS(scaffold_exports);

// node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL(`file:${__filename}`).href : document.currentScript && document.currentScript.tagName.toUpperCase() === "SCRIPT" ? document.currentScript.src : new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/scaffold.ts
var import_path = __toESM(require("path"), 1);
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_url = require("url");
var __dirname = import_path.default.dirname((0, import_url.fileURLToPath)(importMetaUrl));
function resolveTemplateKey(config) {
  const { framework, styling } = config;
  if (framework === "cra") return "foundation-cra";
  if (framework === "astro") return "foundation-astro";
  if (framework === "tanstack") return "foundation-tanstack";
  if (framework === "next-app") {
    return styling === "mui-tailwind" || styling === "shadcn" || styling === "mui-shadcn" || styling === "tailwind" ? "foundation-next-app-tailwind" : "foundation-next-app";
  }
  if (framework === "next-pages") return "foundation-next-pages";
  if (styling === "mui-tailwind") return "foundation-vite-tailwind";
  if (styling === "mui-shadcn") return "foundation-vite-shadcn";
  if (styling === "shadcn") return "foundation-vite-shadcn";
  if (styling === "tailwind") return "foundation-vite-tailwind";
  if (styling === "bootstrap-mui") return "foundation-vite";
  if (styling === "css-modules") return "foundation-vite";
  return "foundation-vite";
}
function getReplacements(config) {
  const layoutVariantValue = config.frame;
  return [
    // Project naming
    { from: /TERAKOTA_FOUNDATION_NAME/g, to: config.projectName },
    { from: /terakota-foundation-name/g, to: config.projectName.toLowerCase().replace(/\s+/g, "-") },
    { from: /TerakotaFoundationName/g, to: toPascalCase(config.projectName) },
    // Layout variant — sets initial Redux state in sidebarSlice
    { from: /TERAKOTA_LAYOUT_VARIANT/g, to: layoutVariantValue },
    // Conditional blocks
    {
      from: /\/\*\s*@if:electron\s*\*\/([\s\S]*?)\/\*\s*@endif:electron\s*\*\//g,
      to: config.desktop === "electron" || config.desktop === "electron-only" ? "$1" : ""
    },
    {
      from: /\/\*\s*@if:pwa\s*\*\/([\s\S]*?)\/\*\s*@endif:pwa\s*\*\//g,
      to: config.desktop === "pwa" || config.desktop === "electron" ? "$1" : ""
    },
    {
      from: /\/\*\s*@if:i18n\s*\*\/([\s\S]*?)\/\*\s*@endif:i18n\s*\*\//g,
      to: config.features.includes("i18n") ? "$1" : ""
    },
    {
      from: /\/\*\s*@if:widgets\s*\*\/([\s\S]*?)\/\*\s*@endif:widgets\s*\*\//g,
      to: config.features.includes("widgets") ? "$1" : ""
    },
    {
      from: /\/\*\s*@if:storybook\s*\*\/([\s\S]*?)\/\*\s*@endif:storybook\s*\*\//g,
      to: config.features.includes("storybook") ? "$1" : ""
    },
    {
      from: /\/\*\s*@if:pwa-ctx\s*\*\/([\s\S]*?)\/\*\s*@endif:pwa-ctx\s*\*\//g,
      to: config.features.includes("pwa-ctx") ? "$1" : ""
    }
  ];
}
function toPascalCase(str) {
  return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c?.toUpperCase() ?? "");
}
function renameForLanguage(filePath, language) {
  if (language === "javascript") {
    return filePath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js").replace(/tsconfig\.json/, "jsconfig.json");
  }
  return filePath;
}
function shouldExclude(relPath, config) {
  const { desktop, features } = config;
  if ((desktop === "web" || desktop === "pwa") && relPath.startsWith("electron/")) return true;
  if (!features.includes("storybook") && (relPath.startsWith(".storybook/") || relPath.includes(".stories."))) return true;
  if (!features.includes("tour") && relPath.includes("/tour/")) return true;
  if (!features.includes("analytics") && relPath.includes("reportWebVitals")) return true;
  if (!features.includes("pwa-ctx") && relPath.includes("/pwa/")) return true;
  return false;
}
function generatePackageJson(config) {
  const { projectName, framework, desktop, styling, stateManager, features, language } = config;
  const deps = {
    "@emotion/is-prop-valid": "^1.4.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@fontsource/dm-sans": "^5.0.21",
    "@fontsource/inter": "^5.0.20",
    "@fontsource/poppins": "^5.0.14",
    "@fontsource/roboto": "^5.0.14",
    "@iconify/react": "^4.0.1",
    "framer-motion": "^11.0.0",
    "react": "^19",
    "react-dom": "^19",
    "styled-components": "^6",
    "usehooks-ts": "^3.1.0"
  };
  if (!["tailwind", "shadcn", "css-modules"].includes(styling)) {
    Object.assign(deps, {
      "@mui/icons-material": "^7",
      "@mui/lab": "^7.0.0-beta",
      "@mui/material": "^7",
      "@mui/system": "^7"
    });
  }
  if (styling === "bootstrap-mui") {
    deps["bootstrap"] = "^5.3.0";
    deps["react-bootstrap"] = "^2.10.0";
  }
  if (["mui-tailwind", "mui-shadcn", "shadcn", "tailwind"].includes(styling)) {
    deps["tailwindcss"] = "^3.4.0";
    deps["postcss"] = "^8.4.0";
    deps["autoprefixer"] = "^10.4.0";
  }
  if (stateManager === "redux") {
    deps["@reduxjs/toolkit"] = "^2.3.0";
    deps["react-redux"] = "^9.0.0";
  } else if (stateManager === "zustand") {
    deps["zustand"] = "^4.5.0";
  } else if (stateManager === "jotai") {
    deps["jotai"] = "^2.7.0";
  }
  if (features.includes("i18n")) {
    deps["i18next"] = "^23.6.0";
    deps["react-i18next"] = "^13.3.1";
  }
  if (framework === "vite" || framework === "cra" || framework === "tanstack") {
    deps["react-router-dom"] = "^6.21.0";
  }
  if (desktop === "pwa" || desktop === "electron") {
    deps["nprogress"] = "^0.2.0";
  }
  if (features.includes("storybook")) {
    deps["@storybook/react"] = "^8.0.0";
    deps["@storybook/react-webpack5"] = "^8.0.0";
  }
  if (features.includes("tour")) {
    deps["react-joyride"] = "^2.9.0";
  }
  const devDeps = {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.2.5"
  };
  if (language === "typescript") {
    devDeps["typescript"] = "^5.5.0";
    devDeps["@types/styled-components"] = "^5.1.34";
    if (deps["nprogress"]) devDeps["@types/nprogress"] = "^0.2.3";
  }
  let buildToolDeps = {};
  let buildScripts = {};
  if (framework === "vite") {
    buildToolDeps = {
      "@vitejs/plugin-react": "^4.3.0",
      "vite": "^6.0.0",
      ...desktop !== "web" && desktop !== "electron-only" ? { "vite-plugin-pwa": "^0.21.0" } : {},
      ...desktop === "electron" || desktop === "electron-only" ? {
        "concurrently": "^9.0.0",
        "electron": "^28.0.0",
        "electron-builder": "^24.0.0",
        "electron-is-dev": "^3.0.0",
        "wait-on": "^7.0.0"
      } : {}
    };
    buildScripts = {
      "dev": "vite",
      "build": language === "typescript" ? "tsc -b && vite build" : "vite build",
      "preview": "vite preview",
      "lint": `eslint . --ext ${language === "typescript" ? "ts,tsx" : "js,jsx"} --report-unused-disable-directives`,
      ...language === "typescript" ? { "typecheck": "tsc --noEmit" } : {},
      ...desktop === "electron" || desktop === "electron-only" ? {
        "dev:electron": 'concurrently "vite" "wait-on http://localhost:3009 && electron ."',
        "build:electron": `${language === "typescript" ? "tsc -b && " : ""}vite build && electron-builder`
      } : {},
      ...features.includes("storybook") ? {
        "storybook": "storybook dev -p 6006",
        "build-storybook": "storybook build"
      } : {}
    };
  } else if (framework === "cra") {
    buildToolDeps = { "react-scripts": "5", "react-app-rewired": "^2.2.1" };
    buildScripts = {
      "start": "cross-env GENERATE_SOURCEMAP=false PORT=3009 react-app-rewired start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    };
    devDeps["cross-env"] = "^7.0.3";
  } else if (framework === "astro") {
    buildToolDeps = { "astro": "^4.0.0", "@astrojs/react": "^3.0.0", "@astrojs/tailwind": "^5.0.0" };
    buildScripts = { "dev": "astro dev", "build": "astro build", "preview": "astro preview" };
  } else if (framework === "next-app" || framework === "next-pages") {
    buildToolDeps = { "next": "^15.0.0" };
    buildScripts = { "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint" };
  }
  return {
    name: projectName.toLowerCase().replace(/\s+/g, "-"),
    version: "0.1.0",
    private: true,
    description: `A Terakota Foundation project \u2014 ${framework} + ${styling}`,
    ...framework === "vite" || framework === "astro" ? { type: "module" } : {},
    scripts: buildScripts,
    dependencies: deps,
    devDependencies: { ...devDeps, ...buildToolDeps },
    engines: { node: ">=18.0.0" }
  };
}
async function createProject(config, cliDir) {
  const { targetDir, language } = config;
  const templateKey = resolveTemplateKey(config);
  const templateDir = resolveTemplateDir(templateKey, cliDir);
  await import_fs_extra.default.ensureDir(targetDir);
  await copyAndTransform(templateDir, targetDir, config);
  const generatedPkg = generatePackageJson(config);
  await import_fs_extra.default.writeJson(import_path.default.join(targetDir, "package.json"), generatedPkg, { spaces: 4 });
  await writeEnvExample(targetDir, config);
  await writeGitignore(targetDir, config);
  await writeReadme(targetDir, config);
  if (config.desktop !== "electron" && config.desktop !== "electron-only") {
    await import_fs_extra.default.remove(import_path.default.join(targetDir, "electron"));
  }
  if (!config.features.includes("i18n")) {
    await import_fs_extra.default.remove(import_path.default.join(targetDir, "src", "i18n"));
  }
}
function resolveTemplateDir(templateKey, cliDir) {
  const distRelative = import_path.default.resolve(cliDir, "..", "templates", templateKey);
  if (import_fs_extra.default.pathExistsSync(distRelative)) return distRelative;
  const monoRelative = import_path.default.resolve(cliDir, "..", "..", "templates", templateKey);
  if (import_fs_extra.default.pathExistsSync(monoRelative)) return monoRelative;
  const fallbacks = {
    "foundation-cra": "foundation-vite",
    "foundation-astro": "foundation-vite",
    "foundation-tanstack": "foundation-vite",
    "foundation-vite-shadcn": "foundation-vite-tailwind",
    "foundation-vite-tailwind-only": "foundation-vite-tailwind",
    "foundation-vite-bootstrap": "foundation-vite",
    "foundation-vite-css-modules": "foundation-vite",
    "foundation-next-app-tailwind": "foundation-next-app",
    "foundation-next-pages": "foundation-next-app"
  };
  const fallbackKey = fallbacks[templateKey];
  if (fallbackKey) {
    const fallbackDist = import_path.default.resolve(cliDir, "..", "templates", fallbackKey);
    if (import_fs_extra.default.pathExistsSync(fallbackDist)) {
      console.warn(`
  \u26A0  Template "${templateKey}" not yet built \u2014 using "${fallbackKey}" as base
`);
      return fallbackDist;
    }
    const fallbackMono = import_path.default.resolve(cliDir, "..", "..", "templates", fallbackKey);
    if (import_fs_extra.default.pathExistsSync(fallbackMono)) {
      console.warn(`
  \u26A0  Template "${templateKey}" not yet built \u2014 using "${fallbackKey}" as base
`);
      return fallbackMono;
    }
  }
  const viteFallback = import_path.default.resolve(cliDir, "..", "..", "templates", "foundation-vite");
  if (import_fs_extra.default.pathExistsSync(viteFallback)) {
    console.warn(`
  \u26A0  Template "${templateKey}" not found \u2014 using foundation-vite as fallback
`);
    return viteFallback;
  }
  throw new Error(`Template directory not found for "${templateKey}"`);
}
async function copyAndTransform(src, dest, config) {
  const replacements = getReplacements(config);
  await import_fs_extra.default.copy(src, dest, {
    filter: (srcPath) => {
      const rel = import_path.default.relative(src, srcPath);
      if (rel === "") return true;
      if (rel.startsWith("node_modules")) return false;
      if (rel === "package.json") return false;
      if (rel === ".gitignore") return false;
      if (rel === ".env.example") return false;
      if (rel === "README.md") return false;
      if (shouldExclude(rel, config)) return false;
      return true;
    },
    overwrite: true
  });
  const allFiles = await getAllFiles(dest);
  for (const filePath of allFiles) {
    const ext = import_path.default.extname(filePath);
    const isText = [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".html", ".md", ".yaml", ".yml", ".env", ".toml", ".cjs", ".mjs"].includes(ext);
    if (isText) {
      let content = await import_fs_extra.default.readFile(filePath, "utf-8");
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      await import_fs_extra.default.writeFile(filePath, content, "utf-8");
    }
    const newPath = renameForLanguage(filePath, config.language);
    if (newPath !== filePath) {
      await import_fs_extra.default.move(filePath, newPath, { overwrite: true });
    }
  }
}
async function getAllFiles(dir) {
  const files = [];
  const items = await import_fs_extra.default.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = import_path.default.join(dir, item.name);
    if (item.isDirectory()) files.push(...await getAllFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}
async function writeEnvExample(targetDir, config) {
  const prefix = config.framework.startsWith("next") ? "" : "VITE_";
  const lines = [
    `# ${config.projectName} \u2014 Environment Variables`,
    `# Copy to .env.local and fill in your values`,
    "",
    `# Platform`,
    `${prefix}PLATFORM=${config.desktop}`,
    `${prefix}APP_NAME=${config.projectName}`,
    `${prefix}APP_VERSION=0.1.0`,
    "",
    `# API`,
    `${prefix}API_BASE_URL=http://localhost:4000/api/v1`,
    "",
    `# Auth \u2014 configure your auth provider`,
    `# CLERK_PUBLISHABLE_KEY=pk_test_...   (Clerk)`,
    `# NEXTAUTH_SECRET=...                 (NextAuth)`,
    "",
    `# AI \u2014 NEVER expose secret keys on the client`,
    `# ANTHROPIC_API_KEY=sk-ant-...   (backend only)`,
    `# OPENAI_API_KEY=sk-...          (backend only)`
  ];
  await import_fs_extra.default.writeFile(import_path.default.join(targetDir, ".env.example"), lines.join("\n") + "\n", "utf-8");
}
async function writeGitignore(targetDir, config) {
  const lines = [
    "# Dependencies",
    "node_modules",
    "",
    "# Build outputs",
    "dist",
    ".next",
    "out",
    "",
    "# Env",
    ".env",
    ".env.local",
    ".env.*.local",
    "",
    "# Logs",
    "*.log",
    "yarn-error.log",
    "",
    "# Editor",
    ".DS_Store",
    ".vscode/*",
    "!.vscode/extensions.json",
    ".idea",
    "",
    "# Misc",
    "coverage",
    "storybook-static",
    ...config.desktop === "electron" || config.desktop === "electron-only" ? ["", "# Electron builds", "release"] : []
  ];
  await import_fs_extra.default.writeFile(import_path.default.join(targetDir, ".gitignore"), lines.join("\n") + "\n", "utf-8");
}
async function writeReadme(targetDir, config) {
  const { projectName, framework, desktop, styling, frame, stateManager, packageManager, features } = config;
  const pm = packageManager;
  const devCmd = framework === "cra" ? "start" : "dev";
  const electronSection = desktop === "electron" || desktop === "electron-only" ? `
### Desktop (Electron)
\`\`\`bash
${pm} run dev:electron
\`\`\`` : "";
  const content = `# ${projectName}

> Built with **Terakota Foundation** \u2014 ${framework} \xB7 ${styling} \xB7 ${frame}

## Getting started

\`\`\`bash
${pm} install
${pm} run ${devCmd}
\`\`\`
${electronSection}

## Stack

| Layer | Choice |
|-------|--------|
| Framework | ${framework} |
| Platform | ${desktop} |
| Styling | ${styling} |
| Layout | ${frame} |
| State | ${stateManager} |
| Language | ${config.language} |
| Features | ${features.join(", ") || "core only"} |

## Layout variant

This project uses the **\`${frame}\`** layout.  
To switch layouts at runtime: dispatch \`setLayoutVariant('sidebar-vertical')\` from any component.

## Project structure

\`\`\`
src/
\u251C\u2500\u2500 app/           # App root, providers
\u251C\u2500\u2500 routes/        # Route definitions
\u251C\u2500\u2500 layouts/       # DashboardLayout + variants
\u251C\u2500\u2500 pages/         # Route-level page components
\u251C\u2500\u2500 features/      # Redux slices (theme, sidebar)
\u251C\u2500\u2500 components/    # Reusable UI components
\u251C\u2500\u2500 utils/         # Helper functions
\u251C\u2500\u2500 i18n/          # Translations (if enabled)
\u2514\u2500\u2500 styles/        # Global CSS
\`\`\`

---
*Scaffolded by [create-terakota](https://foundation.terakota.live)*
`;
  await import_fs_extra.default.writeFile(import_path.default.join(targetDir, "README.md"), content, "utf-8");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProject
});
