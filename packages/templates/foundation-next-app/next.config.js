/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Disable SWC minifier — use Terser instead.
    // SWC minification (and transpilation) both require the native @next/swc-darwin-x64
    // binary which is built for macOS 11+. On macOS 10.15 Catalina it crashes with
    // "truncated mach-o". babel.config.js handles transpilation; this handles minification.
    swcMinify: false,

    async redirects() {
        return [
            { source: '/', destination: '/home', permanent: false },
        ];
    },

    transpilePackages: [
        '@mui/material',
        '@mui/icons-material',
        '@mui/system',
        '@mui/lab',
    ],
};

module.exports = nextConfig;
