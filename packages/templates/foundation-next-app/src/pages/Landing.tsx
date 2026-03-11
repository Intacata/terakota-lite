'use client';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

export default function Landing() {
    const router = useRouter();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={3} alignItems="center" textAlign="center">
                    <Typography variant="h2" fontWeight={800} color="white">
                        Terakota
                    </Typography>
                    <Typography variant="h5" color="rgba(255,255,255,0.8)">
                        Foundation
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.7)" maxWidth={400}>
                        A minimal, production-ready template. Clean, fast, and ready to build on.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/home')}
                            sx={{ backgroundColor: 'white', color: '#1976d2', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => router.push('/login')}
                            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
