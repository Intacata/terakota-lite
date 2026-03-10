import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function LockScreen() {
    const navigate = useNavigate();
    const [pwd, setPwd] = useState('');
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
            <Card sx={{ width: 360 }} elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems="center">
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
                        <Stack spacing={0.5} alignItems="center">
                            <Typography variant="h5" fontWeight={700}>Screen Locked</Typography>
                            <Typography variant="body2" color="text.secondary">Enter your password to continue</Typography>
                        </Stack>
                        <TextField label="Password" type="password" fullWidth value={pwd}
                            onChange={e => setPwd(e.target.value)} autoFocus />
                        <Button variant="contained" fullWidth onClick={() => navigate({ to: '/home' })}>Unlock</Button>
                        <Button variant="text" size="small" onClick={() => navigate({ to: '/login' })}>Different account</Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
export const Route = createFileRoute('/lock')({ component: LockScreen });
