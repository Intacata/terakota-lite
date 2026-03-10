import { createFileRoute } from '@tanstack/react-router';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, resetTheme } from '~/features/theme/themeSlice';
import type { RootState } from '~/store';
import AppShell from '~/layouts/AppShell';

function Settings() {
    const dispatch = useDispatch();
    const theme = useSelector((s: RootState) => s.theme);
    return (
        <AppShell>
            <Stack spacing={3}>
                <Typography variant="h4" fontWeight={700}>Settings</Typography>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Account</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Account settings, profile, notifications and security options will appear here.
                        </Typography>
                    </CardContent>
                </Card>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Appearance</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={<Switch checked={theme.mode === 'dark'} onChange={() => dispatch(toggleTheme())} />}
                                label="Dark mode"
                            />
                            <Button variant="outlined" color="error" size="small" sx={{ width: 'fit-content' }}
                                onClick={() => dispatch(resetTheme())}>
                                Reset Theme
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </AppShell>
    );
}
export const Route = createFileRoute('/settings')({ component: Settings });
