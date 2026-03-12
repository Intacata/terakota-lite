import { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import store from '~/store';
import { getTheme } from '~/features/theme/themeUtils';
import { setTheme } from '~/features/theme/themeSlice';
import { useDynamicFavicon } from '~/utils/faviconUtils';
import type { RootState } from '~/store';

function ThemedApp() {
    const dispatch    = useDispatch();

    const themeMode    = useSelector((s: RootState) => s.theme.mode);
    const direction    = useSelector((s: RootState) => s.theme.direction);
    const colors       = useSelector((s: RootState) => s.theme.colors);
    const typography   = useSelector((s: RootState) => s.theme.typography);
    const borderRadius = useSelector((s: RootState) => s.theme.borderRadius);
    const contrastText = useSelector((s: RootState) => s.theme.contrastText);
    const fontSize     = useSelector((s: RootState) => s.theme.fontSize);

    // Resolve 'system' → actual mode before building MUI theme
    const resolvedMode: 'light' | 'dark' =
        themeMode === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : themeMode;

    const theme = getTheme(resolvedMode, direction, colors, typography, borderRadius, contrastText, fontSize);

    useDynamicFavicon();

    // ── Sync document direction whenever it changes ───────────────────────────
    useEffect(() => {
        document.body.dir = direction;
        document.documentElement.dir = direction;
    }, [direction]);

    // ── Persist chosen theme mode ─────────────────────────────────────────────
    useEffect(() => {
        try { localStorage.setItem('tk-theme-mode', themeMode); } catch { /* ignore */ }
    }, [themeMode]);

    // ── React to OS colour-scheme changes (only in 'system' mode) ────────────
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handle = (e: MediaQueryListEvent) => {
            if (themeMode === 'system') dispatch(setTheme(e.matches ? 'dark' : 'light'));
        };
        mq.addEventListener('change', handle);
        return () => mq.removeEventListener('change', handle);
    }, [dispatch, themeMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Outlet />
        </ThemeProvider>
    );
}

function RootComponent() {
    return (
        <Provider store={store}>
            <ThemedApp />
        </Provider>
    );
}

export const Route = createRootRoute({ component: RootComponent });
