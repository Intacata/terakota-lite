'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

export default function Registration() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: connect to auth service
        router.push('/home');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 480 }} elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Stack spacing={0.5}>
                            <Typography variant="h4" fontWeight={700}>Create account</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Get started for free today
                            </Typography>
                        </Stack>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="First name"
                                            fullWidth
                                            value={form.firstName}
                                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Last name"
                                            fullWidth
                                            value={form.lastName}
                                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <Button type="submit" variant="contained" size="large" fullWidth>
                                    Create Account
                                </Button>
                            </Stack>
                        </Box>

                        <Typography variant="body2" textAlign="center">
                            Already have an account?{' '}
                            <Link onClick={() => router.push('/login')} sx={{ cursor: 'pointer' }}>
                                Sign in
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
