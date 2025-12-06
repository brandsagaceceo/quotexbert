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
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isLoaded && clerkUser) {
        let role = clerkUser.publicMetadata?.role as 'homeowner' | 'contractor' | 'admin' | undefined;
        
        // If no role in session, fetch from database
        if (!role) {
          setRoleLoading(true);
          try {
            const response = await fetch('/api/user/role');
            const data = await response.json();
            if (data.role) {
              role = data.role;
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          } finally {
            setRoleLoading(false);
          }
        }
        
        // Map Clerk user to our User interface
        setAuthUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          role: role || 'homeowner', // Temporary default
          profilePhoto: clerkUser.imageUrl
        });
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
    authLoading: !isLoaded,
    signInWithGoogle,
    setUserRole,
    signOut
  };
}