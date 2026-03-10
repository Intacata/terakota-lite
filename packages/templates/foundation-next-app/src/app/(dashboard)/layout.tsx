'use client';
import DashboardLayout from '~/layouts/DashboardLayout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
