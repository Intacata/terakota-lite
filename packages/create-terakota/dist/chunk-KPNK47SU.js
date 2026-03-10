#!/usr/bin/env node

// src/utils.ts
function validateProjectName(name) {
  if (!name || name.trim().length === 0) return "Project name cannot be empty";
  if (!/^[a-zA-Z0-9]/.test(name)) return "Must start with a letter or number";
  if (!/^[a-zA-Z0-9@._/ -]+$/.test(name)) return "Only letters, numbers, spaces, hyphens, dots, and underscores allowed";
  if (name.length > 214) return "Name too long (max 214 chars)";
  return true;
}
function getPackageManagerChoice() {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  return "npm";
}

export {
  validateProjectName,
  getPackageManagerChoice
};
