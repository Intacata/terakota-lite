import { createTheme, type Direction, type Theme } from '@mui/material/styles';
import type { ThemeColors } from './themeSlice';

// Font stack options — must be loaded via @fontsource/* in styles/index.css
const fontStacks: Record<string, string> = {
    Inter: '"Inter", sans-serif',
    Roboto: '"Roboto", sans-serif',
    Poppins: '"Poppins", sans-serif',
    'DM Sans': '"DM Sans", sans-serif',
};

/**
 * Builds a fully configured MUI 7 theme from individual user preferences.
 * Signature mirrors the original Terakota getTheme() so switching is a
 * drop-in replacement.
 */
export function getTheme(
    mode: 'light' | 'dark',
    direction: Direction,
    colors: ThemeColors,
    typography: string,
    borderRadius: number,
    contrastText: string,
    fontSize: number
): Theme {
    const fontFamily = fontStacks[typography] ?? fontStacks['Inter'];

    return createTheme({
        direction,
        palette: {
            mode,
            primary: {
                main: colors.primary,
                contrastText,
            },
            secondary: {
                main: colors.secondary,
            },
            background: {
                default: mode === 'light' ? '#f5f5f5' : '#121212',
                paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
            },
        },
        typography: {
            fontFamily,
            fontSize,
            h1: { fontWeight: 700 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 600 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
        },
        shape: {
            borderRadius,
        },
        components: {
            // ── CssBaseline ──────────────────────────────────────────────
            MuiCssBaseline: {
                styleOverrides: {
                    '*, *::before, *::after': { boxSizing: 'border-box' },
                    html: { WebkitAppRegion: 'no-drag' },
                    body: {
                        fontFamily,
                        margin: 0,
                        padding: 0,
                    },
                },
            },
            // ── Button ───────────────────────────────────────────────────
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: { textTransform: 'none', borderRadius },
                },
            },
            // ── Paper ────────────────────────────────────────────────────
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' },
                    rounded: { borderRadius },
                },
            },
            // ── Card ─────────────────────────────────────────────────────
            MuiCard: {
                styleOverrides: {
                    root: { borderRadius: borderRadius * 1.5 },
                },
            },
            // ── Input ────────────────────────────────────────────────────
            MuiOutlinedInput: {
                styleOverrides: {
                    root: { borderRadius },
                },
            },
        },
    });
}
