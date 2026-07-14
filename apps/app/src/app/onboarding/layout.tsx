'use client';

import React from 'react';
import { useAuth } from '@/features/auth/auth-context';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 text-sm font-medium">Loading onboarding state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-slate-900 text-white py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-heading font-bold text-lg tracking-tight">SK Cybernet</h1>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Security Onboarding
          </span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-100 p-8 my-8">
          {children}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        &copy; 2026 Chosen Technologies. Secure Workspace Credentials.
      </footer>
    </div>
  );
}
