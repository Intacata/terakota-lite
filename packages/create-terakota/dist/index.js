#!/usr/bin/env node
import {
  DONE_BANNER,
  TERAKOTA_BANNER
} from "./chunk-OQLWNRGA.js";
import {
  createProject
} from "./chunk-ULR66VMU.js";
import {
  validateProjectName
} from "./chunk-KPNK47SU.js";

// src/index.ts
import { program } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { execa } from "execa";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
program.name("create-terakota").description("Create a new Terakota Foundation project").version("1.1.0").argument("[project-name]", "Name of the project to create").option("-t, --template <template>", "Template to use (skips prompts)").option("--no-install", "Skip package installation").option("--no-git", "Skip git initialization").action(async (projectNameArg, opts) => {
  console.log(TERAKOTA_BANNER);
  let projectName = projectNameArg;
  if (!projectName) {
    const res = await prompts({
      type: "text",
      name: "projectName",
      message: "What is your project name?",
      initial: "my-terakota-app",
      validate: validateProjectName
    }, { onCancel: () => process.exit(0) });
    projectName = res.projectName;
  } else {
    const err = validateProjectName(projectName);
    if (typeof err === "string") {
      console.error(chalk.red(`\u2716 ${err}`));
      process.exit(1);
    }
  }
  const targetDir = path.resolve(process.cwd(), projectName);
  if (await fs.pathExists(targetDir)) {
    const res = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `Directory ${chalk.cyan(projectName)} already exists. Overwrite?`,
      initial: false
    }, { onCancel: () => process.exit(0) });
    if (!res.overwrite) process.exit(0);
    await fs.emptyDir(targetDir);
  }
  const frameworkRes = await prompts({
    type: "select",
    name: "framework",
    message: "Choose a framework:",
    choices: [
      { title: `${chalk.yellow("\u26A1")} Vite               ${chalk.dim("\u2014 Fast HMR, ideal for SPAs, PWA & Electron")}`, value: "vite" },
      { title: `${chalk.blue("\u25B2")} Next.js App Router  ${chalk.dim("\u2014 RSC, SSR, file-based routing (recommended for SSR)")}`, value: "next-app" },
      { title: `${chalk.blue("\u25B2")} Next.js Pages Router${chalk.dim("\u2014 Classic Next.js, stable & predictable")}`, value: "next-pages" },
      { title: `${chalk.cyan("\u269B")} CRA                 ${chalk.dim("\u2014 Create React App (legacy/webpack, Terakota origin)")}`, value: "cra" },
      { title: `${chalk.magenta("\u{1F680}")} Astro               ${chalk.dim("\u2014 MPA / content-heavy, islands architecture")}`, value: "astro" },
      { title: `${chalk.gray("\u25C8")} TanStack Start      ${chalk.dim("\u2014 Type-safe full-stack (experimental)")}`, value: "tanstack" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const desktopRes = await prompts({
    type: "select",
    name: "desktop",
    message: "Target platform:",
    choices: [
      { title: `${chalk.green("\u{1F310}")} Web + PWA           ${chalk.dim("\u2014 Installable PWA, service worker, offline ready")}`, value: "pwa" },
      { title: `${chalk.cyan("\u{1F5A5}")}  Web + PWA + Electron ${chalk.dim("\u2014 Full cross-platform: browser + desktop app")}`, value: "electron" },
      { title: `${chalk.cyan("\u{1F4BB}")} Electron Only        ${chalk.dim("\u2014 Desktop app only, no service worker/PWA")}`, value: "electron-only" },
      { title: `${chalk.dim("\u25CB")}  Web Only             ${chalk.dim("\u2014 Plain web app, no PWA or Electron")}`, value: "web" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const stylingRes = await prompts({
    type: "select",
    name: "styling",
    message: "Styling approach:",
    choices: [
      { title: `MUI 7                    ${chalk.dim("\u2014 Material UI components, Emotion, themed")}`, value: "mui" },
      { title: `MUI 7 + Tailwind CSS     ${chalk.dim("\u2014 MUI layout + Tailwind utility classes")}`, value: "mui-tailwind" },
      { title: `MUI 7 + Shadcn + Tailwind${chalk.dim("\u2014 MUI + headless Shadcn components + Tailwind")}`, value: "mui-shadcn" },
      { title: `Shadcn/ui + Tailwind     ${chalk.dim("\u2014 Headless Shadcn components + Tailwind only")}`, value: "shadcn" },
      { title: `Tailwind CSS Only        ${chalk.dim("\u2014 Pure Tailwind, no component library")}`, value: "tailwind" },
      { title: `Bootstrap 5 + MUI 7      ${chalk.dim("\u2014 Legacy Terakota style \u2014 Bootstrap grid + MUI")}`, value: "bootstrap-mui" },
      { title: `CSS Modules / Vanilla    ${chalk.dim("\u2014 Scoped CSS modules, no utility framework")}`, value: "css-modules" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const langRes = await prompts({
    type: "select",
    name: "language",
    message: "Language:",
    choices: [
      { title: `TypeScript ${chalk.dim("(recommended)")}`, value: "typescript" },
      { title: "JavaScript", value: "javascript" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const frameRes = await prompts({
    type: "select",
    name: "frame",
    message: "App frame layout:",
    choices: [
      { title: `Vertical Sidebar              ${chalk.dim("\u2014 Left sidebar + TopBar (collapsible/mini-mode)")}`, value: "sidebar-vertical" },
      { title: `Vertical Sidebar + Right Panel${chalk.dim("\u2014 Left sidebar + TopBar + right info/tools panel")}`, value: "sidebar-vertical-right" },
      { title: `Horizontal (Top) Navigation   ${chalk.dim("\u2014 Full-width top nav bar only, no left sidebar")}`, value: "sidebar-horizontal" },
      { title: `Horizontal Nav + Right Panel  ${chalk.dim("\u2014 Top nav + collapsible right panel")}`, value: "sidebar-horizontal-right" },
      { title: `Dual Panel                    ${chalk.dim("\u2014 Left sidebar + persistent right panel (both always visible)")}`, value: "sidebar-dual" },
      { title: `Minimal                       ${chalk.dim("\u2014 Clean header only, content takes full width")}`, value: "minimal" },
      { title: `Minimal + Right Panel         ${chalk.dim("\u2014 Simple header + slide-in right panel")}`, value: "minimal-right" },
      { title: `Tabbed                        ${chalk.dim("\u2014 IDE/browser-style tab bar navigation")}`, value: "tabbed" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const stateRes = await prompts({
    type: "select",
    name: "stateManager",
    message: "State management:",
    choices: [
      { title: `Redux Toolkit  ${chalk.dim("(recommended \u2014 matches Terakota, best for complex state)")}`, value: "redux" },
      { title: `Zustand        ${chalk.dim("\u2014 Lightweight, minimal boilerplate")}`, value: "zustand" },
      { title: `Jotai          ${chalk.dim("\u2014 Atomic state model")}`, value: "jotai" },
      { title: `Context only   ${chalk.dim("\u2014 React built-in Context + useReducer (no external dep)")}`, value: "context" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const featuresRes = await prompts({
    type: "multiselect",
    name: "features",
    message: "Optional features (space to select, enter to confirm):",
    choices: [
      { title: "i18n / RTL support", value: "i18n", selected: true },
      { title: "Widget / Dashboard system", value: "widgets", selected: true },
      { title: "Auth pages (Login, Register, Lock)", value: "auth", selected: true },
      { title: "Dark / Light / System theme toggle", value: "theme", selected: true },
      { title: "Toast notification system", value: "toast", selected: true },
      { title: "PWA Context + install prompt (from Terakota)", value: "pwa-ctx", selected: false },
      { title: "Storybook component explorer", value: "storybook", selected: false },
      { title: "Guided tour (react-joyride)", value: "tour", selected: false },
      { title: "Web Vitals / Analytics", value: "analytics", selected: false }
    ],
    hint: "\u2014 Space to select, Enter to confirm"
  }, { onCancel: () => process.exit(0) });
  const pmRes = await prompts({
    type: "select",
    name: "pm",
    message: "Package manager:",
    choices: [
      { title: "pnpm", value: "pnpm" },
      { title: "yarn", value: "yarn" },
      { title: "npm", value: "npm" }
    ],
    initial: 0
  }, { onCancel: () => process.exit(0) });
  const config = {
    projectName,
    targetDir,
    framework: frameworkRes.framework,
    desktop: desktopRes.desktop,
    styling: stylingRes.styling,
    language: langRes.language,
    frame: frameRes.frame,
    stateManager: stateRes.stateManager,
    features: featuresRes.features ?? [],
    packageManager: pmRes.pm,
    installDeps: opts.install !== false,
    initGit: opts.git !== false
  };
  console.log();
  console.log(chalk.bold("  Your Terakota Foundation project:"));
  console.log();
  console.log(`  ${chalk.dim("Name")}          ${chalk.cyan(config.projectName)}`);
  console.log(`  ${chalk.dim("Framework")}     ${chalk.yellow(config.framework)}`);
  console.log(`  ${chalk.dim("Platform")}      ${chalk.yellow(config.desktop)}`);
  console.log(`  ${chalk.dim("Styling")}       ${chalk.yellow(config.styling)}`);
  console.log(`  ${chalk.dim("Language")}      ${chalk.yellow(config.language)}`);
  console.log(`  ${chalk.dim("Layout")}        ${chalk.yellow(config.frame)}`);
  console.log(`  ${chalk.dim("State mgr")}     ${chalk.yellow(config.stateManager)}`);
  console.log(`  ${chalk.dim("Features")}      ${chalk.yellow(config.features.join(", ") || "none")}`);
  console.log(`  ${chalk.dim("Package mgr")}   ${chalk.yellow(config.packageManager)}`);
  console.log();
  const confirmRes = await prompts({
    type: "confirm",
    name: "ok",
    message: "Looks good \u2014 scaffold now?",
    initial: true
  }, { onCancel: () => process.exit(0) });
  if (!confirmRes.ok) {
    console.log(chalk.yellow("\n  Cancelled."));
    process.exit(0);
  }
  const scaffoldSpinner = ora("Scaffolding project files...").start();
  try {
    await createProject(config, __dirname);
    scaffoldSpinner.succeed("Project files created");
  } catch (err) {
    scaffoldSpinner.fail("Scaffolding failed");
    console.error(err);
    process.exit(1);
  }
  if (config.initGit) {
    const gitSpinner = ora("Initialising git repository...").start();
    try {
      await execa("git", ["init"], { cwd: targetDir });
      await execa("git", ["add", "-A"], { cwd: targetDir });
      await execa("git", ["commit", "-m", "feat: initial commit from create-terakota"], { cwd: targetDir });
      gitSpinner.succeed("Git repository initialised");
    } catch {
      gitSpinner.warn("Git init skipped (git not found or error)");
    }
  }
  if (config.installDeps) {
    const installSpinner = ora(`Installing dependencies with ${config.packageManager}...`).start();
    try {
      const cmd = config.packageManager === "npm" ? "npm" : config.packageManager;
      await execa(cmd, ["install"], { cwd: targetDir, stdio: "pipe" });
      installSpinner.succeed("Dependencies installed");
    } catch {
      installSpinner.warn(`Dependency installation failed \u2014 run ${config.packageManager} install manually`);
    }
  }
  console.log(DONE_BANNER(config));
});
program.parse();
