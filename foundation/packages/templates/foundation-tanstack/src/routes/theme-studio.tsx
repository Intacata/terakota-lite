import { createFileRoute } from '@tanstack/react-router';
import AppShell from '~/layouts/AppShell';
import ThemeStudioContent from '~/pages/ThemeStudio';

function ThemeStudioPage() {
    return <AppShell><ThemeStudioContent /></AppShell>;
}
export const Route = createFileRoute('/theme-studio')({ component: ThemeStudioPage });
