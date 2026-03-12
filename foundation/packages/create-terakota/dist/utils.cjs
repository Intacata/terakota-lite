#!/usr/bin/env node
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getPackageManagerChoice: () => getPackageManagerChoice,
  validateProjectName: () => validateProjectName
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPackageManagerChoice,
  validateProjectName
});
