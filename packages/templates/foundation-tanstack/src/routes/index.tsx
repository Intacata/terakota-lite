import { createFileRoute, Navigate } from '@tanstack/react-router';

// Root "/" redirects to the dashboard home
export const Route = createFileRoute('/')({
    component: () => <Navigate to="/home" replace />,
});
