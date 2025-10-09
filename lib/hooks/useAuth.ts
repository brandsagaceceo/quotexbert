"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'homeowner' | 'contractor' | 'admin';
  profilePhoto?: string;
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    console.log('Auth hook initializing...');
    
    // Check for existing demo user
    const demoUser = localStorage.getItem('demo_user');
    console.log('Demo user from localStorage:', demoUser);
    
    if (demoUser) {
      try {
        const mockUser = JSON.parse(demoUser);
        console.log('Parsed demo user:', mockUser);
        setAuthUser(mockUser);
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demo_user');
      }
    }
    
    setAuthLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    console.log('Demo sign in with Google');
    return null;
  };

  const setUserRole = async (role: 'homeowner' | 'contractor') => {
    console.log('Demo set user role:', role);
    return null;
  };

  const signOut = async () => {
    localStorage.removeItem('demo_user');
    setAuthUser(null);
    setIsSignedIn(false);
  };

  return {
    authUser,
    user: authUser, // Alias for backward compatibility
    isSignedIn,
    authLoading,
    signInWithGoogle,
    setUserRole,
    signOut
  };
}