'use client';

import { useStoreUserEffect } from '@/hooks/useStoreUserEffect';
import { SignInButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Home() {
  const { isLoading, isAuthenticated } = useStoreUserEffect();
  return (
    <main>
      {isLoading ? (
        <>Loading...</>
      ) : !isAuthenticated ? (
        <SignInButton />
      ) : (
        redirect('/home')
      )}
    </main>
  );
}
