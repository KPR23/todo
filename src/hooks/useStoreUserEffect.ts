'use client';

import { useConvexAuth } from 'convex/react';
import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState<Id<'users'> | null>(null);
  const storeUser = useMutation(api.users.store);
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }
    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}
