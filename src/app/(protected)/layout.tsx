'use client';

import AppLayout from '@/components/Sidebar/app-layout';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
}
