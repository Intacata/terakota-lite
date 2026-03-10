import { useEffect, useRef, useMemo } from 'react';
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
    const initialized = useRef(false);

    const themeMode    = useSelector((s: RootState) => s.theme.mode);
    const direction    = useSelector((s: RootState) => s.theme.direction);
    const colors       = useSelector((s: RootState) => s.theme.colors);
    const typography   = useSelector((s: RootState) => s.theme.typography);
    const borderRadius = useSelector((s: RootState) => s.theme.borderRadius);
    const contrastText = useSelector((s: RootState) => s.theme.contrastText);
    const fontSize     = useSelector((s: RootState) => s.theme.fontSize);

    // Resolve 'system' → actual 'light'/'dark' before building MUI theme
    const resolvedMode: 'light' | 'dark' = useMemo(() => {
        if (themeMode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return themeMode;
    }, [themeMode]);

    const theme = getTheme(resolvedMode, direction, colors, typography, borderRadius, contrastText, fontSize);

    // Sync document direction (LTR / RTL)
    document.body.dir = direction;
    document.documentElement.dir = direction;

    // Apply dynamic favicon
    useDynamicFavicon();

    // ── One-time init: read localStorage first, then fall back to OS preference ─
    // We write directly to localStorage inside the init effect so the persistence
    // effect (which runs in the same batch) never overwrites with the stale
    // Redux initial value of 'light'.
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        const saved = localStorage.getItem(LS_THEME_KEY) as 'light' | 'dark' | null;
        if (saved === 'light' || saved === 'dark') {
            dispatch(setTheme(saved));
        } else {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            const mode: 'light' | 'dark' = mq.matches ? 'dark' : 'light';
            dispatch(setTheme(mode));
            // Write immediately so the save effect below (same render cycle) doesn't
            // overwrite this with the stale initial Redux value.
            localStorage.setItem(LS_THEME_KEY, mode);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Persist manual theme choice to localStorage ────────────────────────────
    // Only runs after initialization to avoid saving the stale initial state.
    useEffect(() => {
        if (!initialized.current) return;
        localStorage.setItem(LS_THEME_KEY, themeMode);
    }, [themeMode]);

    // ── OS colour-scheme change listener (only fires when theme is 'system') ──
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (themeMode === 'system') {
                dispatch(setTheme(e.matches ? 'dark' : 'light'));
            }
        };
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, [dispatch, themeMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <AppRoutes />
        </ThemeProvider>
    );
}
