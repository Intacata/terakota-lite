import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: connect to auth service
        navigate('/home');
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
            <Card sx={{ width: '100%', maxWidth: 440 }} elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Stack spacing={0.5}>
                            <Typography variant="h4" fontWeight={700}>Welcome back</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sign in to your account to continue
                            </Typography>
                        </Stack>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    autoComplete="current-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} size="small" edge="end">
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button type="submit" variant="contained" size="large" fullWidth>
                                    Sign In
                                </Button>
                            </Stack>
                        </Box>

                        <Divider />

                        <Typography variant="body2" textAlign="center">
                            Don't have an account?{' '}
                            <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
                                Sign up
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
