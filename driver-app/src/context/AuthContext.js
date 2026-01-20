import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { getProfile } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const profileData = await getProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  };

  // Derived user object for backward compatibility
  const user = session?.user ? {
    _id: session.user.id,
    id: session.user.id,
    email: session.user.email,
    phone: session.user.phone,
    name: profile?.name || session.user.email?.split('@')[0] || 'User',
    role: profile?.role || 'passenger',
  } : null;

  // Manual login for Demo Mode support
  const login = async (email, password) => {
    try {
      // Import dynamically to avoid circular dependencies if any
      const { signInWithEmail } = require('../services/authService');
      const data = await signInWithEmail(email, password);

      // If it's a demo session, manually update state
      if (data?.session?.access_token === 'mock-token') {
        console.log('⚡ Manual state update for Demo User');
        setSession(data.session);
        setProfile({
          id: data.user.id,
          name: data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1) + ' (Demo)',
          role: data.user.role,
          email: data.user.email
        });
        setLoading(false);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyPhoneLogin = async (phone, otp) => {
    try {
      const { verifyOtp } = require('../services/authService');
      const data = await verifyOtp(phone, otp);

      if (data?.session?.access_token === 'mock-token') {
        console.log('⚡ Manual state update for Demo Phone User');
        setSession(data.session);
        setProfile({
          id: data.user.id,
          name: 'Demo Phone User',
          role: data.user.role,
          phone: data.user.phone
        });
        setLoading(false);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        token: session?.access_token,
        loading,
        loading,
        logout,
        refreshProfile,
        login,
        verifyPhoneLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
