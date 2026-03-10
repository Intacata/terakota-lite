import { redirect } from 'next/navigation';

// Root route redirects to /home
export default function RootPage() {
    redirect('/home');
}
