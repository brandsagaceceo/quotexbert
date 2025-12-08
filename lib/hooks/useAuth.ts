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
  const [roleLoading, setRoleLoading] = useState(true); // Start as true

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isLoaded && clerkUser) {
        // Start with whatever Clerk session has
        let role = clerkUser.publicMetadata?.role as 'homeowner' | 'contractor' | 'admin' | undefined;

        // Always fetch server-side role to pick up updates made during onboarding
        setRoleLoading(true);
        try {
          const response = await fetch('/api/user/role');
          const data = await response.json();
          if (data.role) {
            role = data.role;
          } else {
            // If API returns null/undefined, keep role as undefined
            role = undefined;
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        } finally {
          setRoleLoading(false);
        }
        
        // Only set authUser if we have a role - otherwise set null so pages know user needs onboarding
        if (role) {
          setAuthUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: clerkUser.fullName || clerkUser.firstName || 'User',
            role: role,
            profilePhoto: clerkUser.imageUrl
          });
        } else {
          // User is signed in but has no role - set a partial user object
          setAuthUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: clerkUser.fullName || clerkUser.firstName || 'User',
            role: null as any, // No role yet - needs onboarding
            profilePhoto: clerkUser.imageUrl
          });
        }
      } else if (isLoaded) {
        setAuthUser(null);
      }
    };
    
    fetchUserRole();
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
    authLoading: !isLoaded || roleLoading, // Auth is loading if Clerk is loading OR role is being fetched
    signInWithGoogle,
    setUserRole,
    signOut
  };
}