'use client';
import { useState } from 'react';
import { useNavigate } from 'next/navigation'// router;
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LockIcon from '@mui/icons-material/Lock';

export default function LockScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                backdropFilter: 'blur(8px)',
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 360 }} elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems="center">
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                            <LockIcon />
                        </Avatar>
                        <Stack spacing={0.5} textAlign="center">
                            <Typography variant="h5" fontWeight={700}>Screen Locked</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enter your PIN to unlock
                            </Typography>
                        </Stack>
                        <TextField
                            label="PIN"
                            type="password"
                            fullWidth
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                            autoFocus
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={() => router.push('/home')}
                        >
                            Unlock
                        </Button>
                        <Button variant="text" size="small" onClick={() => router.push('/login')}>
                            Sign in with a different account
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
