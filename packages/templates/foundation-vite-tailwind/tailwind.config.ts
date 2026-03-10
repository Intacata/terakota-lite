import type { Config } from 'tailwindcss';

const config: Config = {
    // Only scan files that use Tailwind — prevents conflicts with MUI
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    // Layer Tailwind as a CSS layer so MUI styles take precedence
    important: ':root',
    corePlugins: {
        // Disable preflight — MUI's CssBaseline handles resets
        preflight: false,
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
