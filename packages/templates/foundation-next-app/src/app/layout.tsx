import type { Metadata } from 'next';
import '~/styles/globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'TERAKOTA_FOUNDATION_NAME',
    description: 'A Terakota Foundation project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
