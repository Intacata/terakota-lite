import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Direction = 'ltr' | 'rtl';

export interface ThemeColors {
    primary: string;
    secondary: string;
}

export interface ThemeState {
    mode: ThemeMode;
    direction: Direction;
    colors: ThemeColors;
    typography: string;
    borderRadius: number;
    contrastText: string;
    fontSize: number;
}

// ── Read initial theme synchronously at module-load time ──────────────────────
// This runs BEFORE the first React render, so there is no race between
// "init effect writes" and "persistence effect reads stale initial value".
function getInitialMode(): 'light' | 'dark' {
    try {
        const saved = localStorage.getItem('tk-theme-mode');
        if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* localStorage unavailable (SSR / privacy mode) */ }
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
}

const initialState: ThemeState = {
    mode: getInitialMode(),
    direction: 'ltr',
    colors: {
        primary: '#1976d2',
        secondary: '#9c27b0',
    },
    typography: 'Inter',
    borderRadius: 8,
    contrastText: '#fff',
    fontSize: 14,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<'light' | 'dark'>) {
            state.mode = action.payload;
        },
        toggleTheme(state) {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setSystemTheme(state) {
            state.mode = 'system';
        },
        setDirection(state, action: PayloadAction<Direction>) {
            state.direction = action.payload;
        },
        toggleDirection(state) {
            state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr';
        },
        setColors(state, action: PayloadAction<Partial<ThemeColors>>) {
            state.colors = { ...state.colors, ...action.payload };
        },
        setTypography(state, action: PayloadAction<string>) {
            state.typography = action.payload;
        },
        setBorderRadius(state, action: PayloadAction<number>) {
            state.borderRadius = action.payload;
        },
        setFontSize(state, action: PayloadAction<number>) {
            state.fontSize = action.payload;
        },
        resetTheme() {
            return initialState;
        },
    },
});

export const {
    setTheme,
    toggleTheme,
    setSystemTheme,
    setDirection,
    toggleDirection,
    setColors,
    setTypography,
    setBorderRadius,
    setFontSize,
    resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
