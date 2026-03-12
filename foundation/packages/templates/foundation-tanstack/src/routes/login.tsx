import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {
    const navigate = useNavigate();
    const [showPwd, setShowPwd] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); navigate({ to: '/home' }); };
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Card sx={{ width: '100%', maxWidth: 440 }} elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Stack spacing={0.5}>
                            <Typography variant="h4" fontWeight={700}>Welcome back</Typography>
                            <Typography variant="body2" color="text.secondary">Sign in to continue</Typography>
                        </Stack>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField label="Email" type="email" fullWidth value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })} autoFocus />
                                <TextField label="Password" type={showPwd ? 'text' : 'password'} fullWidth
                                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    InputProps={{ endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setShowPwd(!showPwd)} edge="end">
                                                {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ) }} />
                                <Button type="submit" variant="contained" size="large" fullWidth>Sign In</Button>
                            </Stack>
                        </Box>
                        <Divider />
                        <Typography variant="body2" textAlign="center">
                            No account? <Link onClick={() => navigate({ to: '/register' })} sx={{ cursor: 'pointer' }}>Sign up</Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
export const Route = createFileRoute('/login')({ component: Login });
