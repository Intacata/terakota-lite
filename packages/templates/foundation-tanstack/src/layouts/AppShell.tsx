import { Suspense } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import DashboardLayout from '~/layouts/DashboardLayout';

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            <Suspense fallback={<LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }} />}>
                {children}
            </Suspense>
        </DashboardLayout>
    );
}
