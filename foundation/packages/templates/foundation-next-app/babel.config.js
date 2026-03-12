// This file forces Next.js to use Babel instead of the native SWC compiler.
// Required for macOS 10.15 Catalina where the SWC binary (macOS 11+ only)
// fails to load with a "truncated mach-o" error.
// next/babel includes all necessary presets: react, typescript, styled-components, etc.
module.exports = {
    presets: ['next/babel'],
};
