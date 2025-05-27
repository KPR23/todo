'use client';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Hello World</h1>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
        <AuthLoading>
          <p>Still loading</p>
        </AuthLoading>
      </main>
    </div>
  );
}
