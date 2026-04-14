"use client";

import { useUser, useClerk } from '@clerk/nextjs';
import { useState, useEffect, useRef } from 'react';

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

  // Track the Clerk user ID so we can detect account switches
  const prevClerkIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isLoaded && clerkUser) {
        // Detect account switch — clear stale authUser immediately
        if (prevClerkIdRef.current && prevClerkIdRef.current !== clerkUser.id) {
          setAuthUser(null);
        }
        prevClerkIdRef.current = clerkUser.id;

        // Start with whatever Clerk session has
        let role = clerkUser.publicMetadata?.role as 'homeowner' | 'contractor' | 'admin' | undefined;
        let dbProfilePhoto: string | null = null;

        // Always fetch server-side role to pick up updates made during onboarding
        setRoleLoading(true);
        try {
          const response = await fetch('/api/user/role');
          const data = await response.json();
          // Use API role if available, otherwise fall back to Clerk metadata
          // This ensures we get the most up-to-date role from the database
          if (data.role) {
            role = data.role;
          }
          // Use DB profile photo if set, otherwise fall back to Clerk OAuth image
          if (data.profilePhoto) {
            dbProfilePhoto = data.profilePhoto;
          }
          // If both API and Clerk have no role, then role stays undefined
        } catch (error) {
          console.error('Error fetching user role:', error);
          // On error, keep the Clerk role if available
        } finally {
          setRoleLoading(false);
        }
        
        // Generate proper name with fallback logic (consistent with backend)
        const email = clerkUser.primaryEmailAddress?.emailAddress || '';
        let userName = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
        if (!userName && email) {
          // Use email prefix as name (e.g., 'john.doe@gmail.com' -> 'john doe')
          const emailPrefix = email.split('@')[0] || '';
          userName = emailPrefix ? emailPrefix.replace(/[._-]/g, ' ').trim() : 'User';
          if (!userName) userName = 'User';
        }
        if (!userName) {
          userName = 'User';
        }
        
        // Only set authUser if we have a role - otherwise set null so pages know user needs onboarding
        if (role) {
          setAuthUser({
            id: clerkUser.id,
            email: email,
            name: userName,
            role: role,
            profilePhoto: dbProfilePhoto || clerkUser.imageUrl
          });
        } else {
          // User is signed in but has no role - set a partial user object
          setAuthUser({
            id: clerkUser.id,
            email: email,
            name: userName,
            role: null as any, // No role yet - needs onboarding
            profilePhoto: dbProfilePhoto || clerkUser.imageUrl
          });
        }
      } else if (isLoaded) {
        setAuthUser(null);
        prevClerkIdRef.current = null;
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