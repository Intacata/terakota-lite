import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths({ projects: ['./tsconfig.json'] }),
        TanStackRouterVite(),
        react(),
    ],
    server: {
        port: 3009,
    },
});
