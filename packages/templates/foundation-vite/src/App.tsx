import { useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';

import AppRoutes from '~/routes';
import { getTheme } from '~/features/theme/themeUtils';
import { setTheme } from '~/features/theme/themeSlice';
import { useDynamicFavicon } from '~/utils/faviconUtils';
import type { RootState } from '~/store';

import './styles/index.css';

const LS_THEME_KEY = 'tk-theme-mode';

export default function App() {
    const dispatch = useDispatch();

    const themeMode    = useSelector((s: RootState) => s.theme.mode);
    const direction    = useSelector((s: RootState) => s.theme.direction);
    const colors       = useSelector((s: RootState) => s.theme.colors);
    const typography   = useSelector((s: RootState) => s.theme.typography);
    const borderRadius = useSelector((s: RootState) => s.theme.borderRadius);
    const contrastText = useSelector((s: RootState) => s.theme.contrastText);
    const fontSize     = useSelector((s: RootState) => s.theme.fontSize);

    // 'system' resolves to the actual OS colour preference at render time.
    const resolvedMode: 'light' | 'dark' = useMemo(() => {
        if (themeMode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return themeMode as 'light' | 'dark';
    }, [themeMode]);

    const theme = getTheme(resolvedMode, direction, colors, typography, borderRadius, contrastText, fontSize);

    // Apply dynamic favicon
    useDynamicFavicon();

    // ── Sync document direction whenever Redux direction changes ──────────────
    useEffect(() => {
        document.body.dir = direction;
        document.documentElement.dir = direction;
    }, [direction]);

    // ── Persist the user's chosen mode to localStorage ───────────────────────
    // themeSlice.ts initialises mode from localStorage/OS at module-load time,
    // so this effect only fires on subsequent user changes — no stale overwrite.
    useEffect(() => {
        try { localStorage.setItem(LS_THEME_KEY, themeMode); } catch { /* ignore */ }
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
            <AppRoutes />
        </ThemeProvider>
    );
}
