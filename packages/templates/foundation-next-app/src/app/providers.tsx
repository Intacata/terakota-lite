'use client';

import { type ReactNode } from 'react';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '~/store';
import { getTheme } from '~/features/theme/themeUtils';
import type { RootState } from '~/store';

// ─── Inner ThemeProvider (needs Redux store access) ───────────────────────────
function MuiThemeProvider({ children }: { children: ReactNode }) {
    const themeState = useSelector((s: RootState) => s.theme);
    const resolvedMode: 'light' | 'dark' =
        themeState.mode === 'system'
            ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : themeState.mode as 'light' | 'dark';

    const theme = getTheme(
        resolvedMode,
        themeState.direction as 'ltr' | 'rtl',
        themeState.colors,
        themeState.typography,
        themeState.borderRadius,
        themeState.contrastText,
        themeState.fontSize,
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

// ─── Root providers ───────────────────────────────────────────────────────────
export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <MuiThemeProvider>
                {children}
            </MuiThemeProvider>
        </Provider>
    );
}
