import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

import Landing  from '~/pages/Landing';
import Login    from '~/pages/Login';
import NotFound from '~/pages/NotFound';

const Home        = lazy(() => import('~/pages/Home'));
const Settings    = lazy(() => import('~/pages/Settings'));
const ThemeStudio = lazy(() => import('~/pages/ThemeStudio'));
const ErrorPage   = lazy(() => import('~/pages/ErrorPage'));
const Unauthorized  = lazy(() => import('~/pages/Unauthorized'));
const LockScreen  = lazy(() => import('~/pages/LockScreen'));
const Registration= lazy(() => import('~/pages/Registration'));
const AppContainer= lazy(() => import('~/layouts/AppContainer'));

function PageLoader() {
    return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }} />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* ── Public ───────────────────────────────────── */}
                    <Route path="/"         element={<Landing />} />
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/signup"   element={<Navigate to="/register" replace />} />
                    <Route path="/lock"     element={<LockScreen />} />

                    {/* ── Error / Status ───────────────────────────── */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="/500" element={<ErrorPage />} />
                    <Route path="/403" element={<Unauthorized />} />

                    {/* ── Authenticated App Shell ───────────────────── */}
                    <Route path="/home"         element={<AppContainer page="home" />} />
                    <Route path="/settings"     element={<AppContainer page="settings" />} />
                    <Route path="/theme-studio" element={<AppContainer page="theme-studio" />} />
                    <Route path="/widgets"      element={<AppContainer page="widgets" />} />

                    {/* ── Fallback ─────────────────────────────────── */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
/*
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │  ELECTRON MODE: replace BrowserRouter with HashRouter                       │
 │  1. In vite.config.ts set: base: './'                                       │
 │  2. Swap BrowserRouter → HashRouter here                                    │
 │  Tip: Use import.meta.env.VITE_PLATFORM === 'electron' to auto-switch.      │
 └─────────────────────────────────────────────────────────────────────────────┘
*/
