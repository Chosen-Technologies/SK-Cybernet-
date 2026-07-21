'use client';

import React, { useState } from 'react';
import { ShieldCheck, X, ShieldAlert, Calendar, UserCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: {
    name: string;
    cost: number;
    duration: string;
  } | null;
  availableCredits: number;
  onConfirm: (pin: string) => Promise<void>;
}

export default function BookingModal({
  isOpen,
  onClose,
  tier,
  availableCredits,
  onConfirm
}: BookingModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !tier) return null;

  const hasSufficientCredits = availableCredits >= tier.cost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('Payment PIN must be exactly 4 digits.');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(pin);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Invalid Payment PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
        <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl text-center space-y-4 border border-slate-100">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Booking Confirmed!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your pass has been generated. You can view your active check-in QR code in the **Passes** tab.
            </p>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setPin('');
              onClose();
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl space-y-5 relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-heading font-bold text-slate-900 text-lg">Confirm Workspace Booking</h3>
          <p className="text-xs text-slate-400">Redeem platform credits for instant hub access.</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-sm text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Subscription Tier</span>
            <span className="font-semibold text-slate-900">{tier.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Access Duration</span>
            <span className="font-semibold text-slate-900">{tier.duration}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
            <span>Total Cost</span>
            <span className="text-blue-600">{tier.cost.toFixed(1)} CR</span>
          </div>
        </div>

        {!hasSufficientCredits ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-xs flex gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Insufficient Credit Balance</p>
              <p className="mt-0.5">Please fund your wallet tab with Naira to automatically obtain credits first.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs flex gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2 text-center">
                Enter 4-Digit Payment PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="block w-full rounded-xl border border-slate-200 py-3 text-center tracking-[2em] font-bold text-xl text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              {loading ? 'Authorizing checkout...' : `Authorize & Deduct ${tier.cost.toFixed(1)} CR`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
