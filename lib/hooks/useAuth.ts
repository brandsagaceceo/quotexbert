import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'homeowner' | 'contractor';
  profilePhoto?: string;
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth) {
      console.warn('Firebase auth not configured. Using mock authentication for demo.');
      
      // Check for existing demo user
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        try {
          const mockUser = JSON.parse(demoUser);
          setAuthUser(mockUser);
          setIsSignedIn(true);
        } catch (error) {
          console.error('Error parsing demo user:', error);
          localStorage.removeItem('demo_user');
        }
      }
      
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if user has a role set in localStorage
        const storedRole = localStorage.getItem(`user_role_${firebaseUser.uid}`);
        
        if (storedRole) {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            role: storedRole as 'homeowner' | 'contractor',
            ...(firebaseUser.photoURL && { profilePhoto: firebaseUser.photoURL })
          };
          setAuthUser(user);
          setIsSignedIn(true);
        } else {
          // User needs to select a role
          setAuthUser(null);
          setIsSignedIn(false);
        }
      } else {
        setAuthUser(null);
        setIsSignedIn(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      // Mock authentication for demo purposes when Firebase is not configured
      console.warn('Firebase not configured. Using mock authentication.');
      
      // Create a mock user
      const mockUser: User = {
        id: 'demo-user-' + Date.now(),
        email: 'demo@quotexpert.com',
        name: 'Demo User',
        role: 'homeowner', // Default role, will be changed in role selection
        profilePhoto: `https://ui-avatars.com/api/?name=Demo+User&background=3b82f6&color=fff`
      };
      
      // Store mock user data
      localStorage.setItem(`user_role_${mockUser.id}`, mockUser.role);
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, user: null }; // Return null user to trigger role selection
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Don't set user state here - let the auth state change handler do it
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  const setUserRole = async (role: 'homeowner' | 'contractor') => {
    // Handle mock user (when Firebase is not configured)
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser && !auth?.currentUser) {
      const mockUser = JSON.parse(demoUser);
      const updatedUser: User = {
        ...mockUser,
        role
      };
      
      localStorage.setItem(`user_role_${mockUser.id}`, role);
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
      
      // Create user in database
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role
          })
        });
      } catch (error) {
        console.error('Failed to create user in database:', error);
      }
      
      setAuthUser(updatedUser);
      setIsSignedIn(true);
      return;
    }

    // Handle real Firebase user
    if (auth?.currentUser) {
      localStorage.setItem(`user_role_${auth.currentUser.uid}`, role);
      
      const user: User = {
        id: auth.currentUser.uid,
        email: auth.currentUser.email || '',
        name: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || '',
        role,
        ...(auth.currentUser.photoURL && { profilePhoto: auth.currentUser.photoURL })
      };
      
      // Create user in database
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role
          })
        });
      } catch (error) {
        console.error('Failed to create user in database:', error);
      }
      
      setAuthUser(user);
      setIsSignedIn(true);
    }
  };

  const signOut = async () => {
    try {
      // Handle mock user cleanup
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        const mockUser = JSON.parse(demoUser);
        localStorage.removeItem(`user_role_${mockUser.id}`);
        localStorage.removeItem('demo_user');
      }

      // Handle Firebase user cleanup
      if (auth?.currentUser) {
        localStorage.removeItem(`user_role_${auth.currentUser.uid}`);
        await firebaseSignOut(auth);
      }
      
      setAuthUser(null);
      setIsSignedIn(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Legacy methods for compatibility
  const signIn = async (email: string, password: string) => {
    // For demo purposes, redirect to Google sign-in
    return signInWithGoogle();
  };

  const signUp = async (email: string, password: string, role: 'homeowner' | 'contractor') => {
    // For demo purposes, redirect to Google sign-in
    const result = await signInWithGoogle();
    if (result.success && auth.currentUser) {
      setUserRole(role);
    }
    return result;
  };

  return {
    authUser,
    isSignedIn,
    authLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    setUserRole
  };
}