'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (dto: any) => Promise<void>;
  register: (dto: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const data = await apiRequest('/auth/me');
      setUser(data);
    } catch (error) {
      setUser(null);
      try {
        // Call backend to clear the HttpOnly access_token cookie
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch (logoutError) {
        // Ignore logout error if session was already destroyed
      }
      // Clear non-HttpOnly onboarding status cookie
      document.cookie = 'onboarding_status=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/login?clear=true');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (dto: any) => {
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
      setUser(data.user);
      if (data.user.onboardingStatus === 'complete') {
        router.push('/dashboard');
      } else {
        router.push('/onboarding/start');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (dto: any) => {
    setLoading(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
      setUser(data.user);
      router.push('/onboarding/start');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login?clear=true');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
