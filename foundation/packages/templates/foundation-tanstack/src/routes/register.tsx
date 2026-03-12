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

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); navigate({ to: '/home' }); };
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Card sx={{ width: '100%', maxWidth: 440 }} elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Stack spacing={0.5}>
                            <Typography variant="h4" fontWeight={700}>Create account</Typography>
                            <Typography variant="body2" color="text.secondary">Get started for free</Typography>
                        </Stack>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField label="Full Name" fullWidth value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
                                <TextField label="Email" type="email" fullWidth value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                <TextField label="Password" type="password" fullWidth value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                                <Button type="submit" variant="contained" size="large" fullWidth>Create Account</Button>
                            </Stack>
                        </Box>
                        <Divider />
                        <Typography variant="body2" textAlign="center">
                            Have an account? <Link onClick={() => navigate({ to: '/login' })} sx={{ cursor: 'pointer' }}>Sign in</Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
export const Route = createFileRoute('/register')({ component: Register });
