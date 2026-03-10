import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // Redirect root → /home
    async redirects() {
        return [
            { source: '/', destination: '/home', permanent: false },
        ];
    },
    // Transpile MUI packages (required for Next.js + MUI to work correctly)
    transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/system', '@mui/lab'],
};

export default nextConfig;
