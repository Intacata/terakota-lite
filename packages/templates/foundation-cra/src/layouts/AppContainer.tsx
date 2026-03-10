import { lazy, Suspense } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import DashboardLayout from '~/layouts/DashboardLayout';

// ─── Page registry ─────────────────────────────────────────────────────────── 
// Add new pages here. Each key is a route `page` prop from routes/index.tsx.
const pageRegistry: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
    home:     lazy(() => import('~/pages/Home')),
    settings: lazy(() => import('~/pages/Settings')),
    /*@if:widgets*/
    // dashboard: lazy(() => import('~/pages/Dashboard')),
    // widgets:   lazy(() => import('~/pages/Widgets')),
    /*@endif:widgets*/
};

interface AppContainerProps {
    page: string;
}

export default function AppContainer({ page }: AppContainerProps) {
    const PageComponent = pageRegistry[page] ?? pageRegistry['home'];

    return (
        <DashboardLayout>
            <Suspense fallback={<LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }} />}>
                <PageComponent />
            </Suspense>
        </DashboardLayout>
    );
}
