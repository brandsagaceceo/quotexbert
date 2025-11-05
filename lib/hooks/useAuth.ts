"use client";

import { useUser, useClerk } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'homeowner' | 'contractor' | 'admin';
  profilePhoto?: string;
}

export function useAuth() {
  const { user: clerkUser, isSignedIn: clerkIsSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      // Map Clerk user to our User interface
      setAuthUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        role: (clerkUser.publicMetadata?.role as 'homeowner' | 'contractor' | 'admin') || 'homeowner',
        profilePhoto: clerkUser.imageUrl
      });
    } else if (isLoaded) {
      setAuthUser(null);
    }
  }, [clerkUser, isLoaded]);

  const signInWithGoogle = async () => {
    // Redirect to Clerk sign-in page
    return { success: false, redirect: '/sign-in' };
  };

  const setUserRole = async (role: 'homeowner' | 'contractor') => {
    // Role should be set through Clerk's user metadata
    return { success: true };
  };

  const signOut = async () => {
    await clerkSignOut();
    setAuthUser(null);
  };

  return {
    authUser,
    user: authUser, // Alias for backward compatibility
    isSignedIn: clerkIsSignedIn || false,
    authLoading: !isLoaded,
    signInWithGoogle,
    setUserRole,
    signOut
  };
}