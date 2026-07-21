'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { User, ShieldAlert } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function NameOnboardingPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fName = firstName.trim();
    const lName = lastName.trim();
    const mName = middleName.trim();

    if (!fName || !lName) {
      setError('First name and Last name are strictly required.');
      return;
    }

    setLoading(true);
    try {
      const combinedName = mName ? `${fName} ${mName} ${lName}` : `${fName} ${lName}`;
      
      // Update profile name on the NestJS API
      await apiRequest('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ fullName: combinedName }),
      });

      // Refresh the local session state
      await refreshUser();
      
      // Navigate to phone verification
      router.push('/onboarding/phone');
    } catch (err: any) {
      setError(err.message || 'Failed to save name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          <User className="h-6 w-6" />
        </div>
        <h2 className="mt-3 font-heading text-2xl font-bold text-slate-900">Legal Profile Name</h2>
        <p className="mt-1 text-sm text-slate-600">
          Please enter your full legal name as it appears on your government-issued ID card. This name is required for verification.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex items-start gap-2">
          <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">First Name *</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g. John"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Middle Name (Optional)</label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g. Robert"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Last Name (Surname) *</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g. Doe"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center items-center gap-2 rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none transition-colors disabled:bg-slate-400 mt-6"
        >
          {loading ? 'Saving Profile...' : 'Continue Onboarding'}
        </button>
      </form>
    </div>
  );
}
