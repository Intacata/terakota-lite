# Release Notes — v1.3.3

**Released:** March 2025  
**Tag:** `foundation-v1.3.3`  
**Status:** ✅ Latest stable

## Summary

Fixes GitHub Actions failing because the compiled CLI bundle (`dist/index.cjs`) was blocked by an overly-broad `.gitignore` rule. Also hardens the validate workflow.

## Fixed
- `.gitignore` `dist/` rule blocked CLI bundle from being committed → Actions `Cannot find module` error
- Replaced with specific patterns so template build outputs are ignored but the CLI bundle is always tracked
- Validate workflow: added explicit missing-bundle error message and Next.js router hook check

## No changes to generated projects
This release only affects the repo infrastructure. Generated project output is identical to v1.3.2.
