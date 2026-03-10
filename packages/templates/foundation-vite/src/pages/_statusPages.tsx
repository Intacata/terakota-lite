import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function StatusPage({
    code,
    title,
    subtitle,
    action,
}: {
    code: string;
    title: string;
    subtitle: string;
    action?: { label: string; to: string };
}) {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 4,
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" fontWeight={900} sx={{ fontSize: '6rem', color: 'text.disabled' }}>
                {code}
            </Typography>
            <Typography variant="h4" fontWeight={700}>{title}</Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={400}>
                {subtitle}
            </Typography>
            {action && (
                <Button variant="contained" size="large" onClick={() => navigate(action.to)}>
                    {action.label}
                </Button>
            )}
        </Box>
    );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function NotFound() {
    return (
        <StatusPage
            code="404"
            title="Page not found"
            subtitle="The page you were looking for doesn't exist or has been moved."
            action={{ label: 'Go Home', to: '/' }}
        />
    );
}

export function ErrorPage() {
    return (
        <StatusPage
            code="500"
            title="Something went wrong"
            subtitle="An unexpected server error occurred. Please try again later."
            action={{ label: 'Go Home', to: '/' }}
        />
    );
}

export function Unauthorized() {
    return (
        <StatusPage
            code="403"
            title="Access denied"
            subtitle="You don't have permission to access this page."
            action={{ label: 'Go Home', to: '/' }}
        />
    );
}
