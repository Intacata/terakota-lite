import type { FoundationConfig } from './types.js';

// ─── Validation ───────────────────────────────────────────────────────────────
export function validateProjectName(name: string): true | string {
    if (!name || name.trim().length === 0) return 'Project name cannot be empty';
    // Allow any letter or number to start (including uppercase like "Dashbuds")
    if (!/^[a-zA-Z0-9]/.test(name)) return 'Must start with a letter or number';
    if (!/^[a-zA-Z0-9@._/ -]+$/.test(name)) return 'Only letters, numbers, spaces, hyphens, dots, and underscores allowed';
    if (name.length > 214) return 'Name too long (max 214 chars)';
    return true;
}

export function getPackageManagerChoice(): string {
    const ua = process.env.npm_config_user_agent ?? '';
    if (ua.includes('pnpm')) return 'pnpm';
    if (ua.includes('yarn')) return 'yarn';
    return 'npm';
}
