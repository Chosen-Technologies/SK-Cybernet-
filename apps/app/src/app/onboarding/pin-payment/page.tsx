'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { apiRequest } from '@/lib/api';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function PinPaymentOnboardingPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNextStage = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('Payment PIN must be a 4-digit numeric code.');
      return;
    }
    setStage('confirm');
  };

  const handleConfirmPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin !== confirmPin) {
      setError('PINs do not match. Please start over.');
      setPin('');
      setConfirmPin('');
      setStage('enter');
      return;
    }

    setLoading(true);

    try {
      await apiRequest('/auth/onboarding/pin/payment', {
        method: 'POST',
        body: JSON.stringify({ pin }),
      });
      await refreshUser();
      router.push('/onboarding/start');
    } catch (err: any) {
      setError(err.message || 'Failed to configure payment PIN. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-3 font-heading text-2xl font-bold text-slate-900">
          {stage === 'enter' ? 'Setup Payment PIN' : 'Confirm Payment PIN'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {stage === 'enter'
            ? 'Create a 4-digit security PIN to authorize wallet debits and credit bookings.'
            : 'Re-enter your 4-digit payment PIN to confirm.'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex items-start gap-2">
          <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {stage === 'enter' ? (
        <form onSubmit={handleNextStage} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 text-center">
              Enter 4-Digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="block w-full rounded-lg border border-slate-200 py-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 tracking-[1.5em] text-center font-bold text-2xl"
              placeholder="••••"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center items-center gap-2 rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none transition-colors"
          >
            Next Step
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmPin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 text-center">
              Re-enter 4-Digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              className="block w-full rounded-lg border border-slate-200 py-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 tracking-[1.5em] text-center font-bold text-2xl"
              placeholder="••••"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none transition-colors disabled:bg-slate-400"
            >
              {loading ? 'Configuring...' : 'Confirm and Save'}
            </button>

            <button
              type="button"
              onClick={() => {
                setPin('');
                setConfirmPin('');
                setStage('enter');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 text-center py-2"
            >
              Start Over
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
