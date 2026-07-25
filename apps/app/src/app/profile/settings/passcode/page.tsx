'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { apiRequest } from '@/lib/api';
import { ArrowLeft, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function ChangePasscodePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPhoneVerified = !!(user?.phone && user?.auth?.phoneVerifiedAt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPhoneVerified) {
      setError('Please verify your phone number first before setting a passcode.');
      return;
    }

    if (step === 'enter') {
      if (passcode.length !== 6 || !/^\d+$/.test(passcode)) {
        setError('Passcode must be a 6-digit numeric code.');
        return;
      }
      setStep('confirm');
      return;
    }

    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match. Please start over.');
      setPasscode('');
      setConfirmPasscode('');
      setStep('enter');
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/auth/onboarding/pin/login', {
        method: 'POST',
        body: JSON.stringify({ pin: passcode }),
      });
      await refreshUser();
      setSuccess('6-Digit Login Passcode configured successfully!');
      setTimeout(() => {
        router.push('/profile/settings');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update passcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <Link 
            href="/profile/settings"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-bold text-lg tracking-tight">Login Passcode</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              {step === 'enter' ? 'Setup Passcode' : 'Confirm Passcode'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {step === 'enter'
                ? 'Create a 6-digit numeric passcode to secure your mobile workspace login.'
                : 'Please re-enter your 6-digit passcode to confirm.'}
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-xs text-red-800 border border-red-100 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100 flex gap-2">
              <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!isPhoneVerified ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-amber-50 p-4 text-xs text-amber-800 border border-amber-100 flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>You must verify your phone number before setting up a login passcode.</span>
              </div>
              <Link
                href="/profile/settings/phone"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center text-sm transition-colors block"
              >
                Go to Phone Verification
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={step === 'enter' ? passcode : confirmPasscode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (step === 'enter') setPasscode(val);
                    else setConfirmPasscode(val);
                  }}
                  className="block w-full rounded-xl border border-slate-200 py-3.5 pl-4 pr-11 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 tracking-[1em] text-center font-bold text-xl"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasscode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || (step === 'enter' ? passcode.length !== 6 : confirmPasscode.length !== 6)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors disabled:bg-slate-400"
              >
                {loading ? 'Saving passcode...' : step === 'enter' ? 'Next' : 'Confirm and Save'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
