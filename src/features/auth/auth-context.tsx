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
  updateUserLocal: (updatedFields: Partial<any>) => void;
  uploadAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const saveUserProfile = (userData: any) => {
    if (typeof window !== 'undefined' && userData) {
      const profile = {
        email: userData.email,
        fullName: userData.fullName,
        avatarUrl: userData.avatarUrl,
      };
      localStorage.setItem('last_user_profile', JSON.stringify(profile));
    }
  };

  const refreshUser = async () => {
    try {
      const data = await apiRequest('/auth/me');
      const storedKycLevel = typeof window !== 'undefined' ? (localStorage.getItem('profile_kyc_level') ?? '1') : '1';
      const storedStudentStatus = typeof window !== 'undefined' ? (localStorage.getItem('student_status') ?? 'unverified') : 'unverified';
      const updatedUser = { ...data, kycLevel: storedKycLevel, studentStatus: storedStudentStatus };
      setUser(updatedUser);
      saveUserProfile(updatedUser);
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
      const storedKycLevel = typeof window !== 'undefined' ? (localStorage.getItem('profile_kyc_level') ?? '1') : '1';
      const storedStudentStatus = typeof window !== 'undefined' ? (localStorage.getItem('student_status') ?? 'unverified') : 'unverified';
      const updatedUser = { ...data.user, kycLevel: storedKycLevel, studentStatus: storedStudentStatus };
      setUser(updatedUser);
      saveUserProfile(updatedUser);
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
      const storedKycLevel = typeof window !== 'undefined' ? (localStorage.getItem('profile_kyc_level') ?? '1') : '1';
      const storedStudentStatus = typeof window !== 'undefined' ? (localStorage.getItem('student_status') ?? 'unverified') : 'unverified';
      const updatedUser = { ...data.user, kycLevel: storedKycLevel, studentStatus: storedStudentStatus };
      setUser(updatedUser);
      saveUserProfile(updatedUser);
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('last_user_profile');
      }
      router.push('/login?clear=true');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserLocal = (updatedFields: Partial<any>) => {
    setUser((prev: any) => {
      if (!prev) return null;
      if (updatedFields.kycLevel && typeof window !== 'undefined') {
        localStorage.setItem('profile_kyc_level', updatedFields.kycLevel);
      }
      if (updatedFields.studentStatus && typeof window !== 'undefined') {
        localStorage.setItem('student_status', updatedFields.studentStatus);
      }
      const updated = { ...prev, ...updatedFields };
      saveUserProfile(updated);
      return updated;
    });
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const data = await apiRequest('/auth/avatar', {
        method: 'POST',
        body: formData,
      });
      setUser((prev: any) => {
        if (!prev) return null;
        const updated = { ...prev, avatarUrl: data.avatarUrl };
        saveUserProfile(updated);
        return updated;
      });
      return data.avatarUrl;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateUserLocal, uploadAvatar }}>
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
