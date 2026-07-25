'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { apiRequest } from '@/lib/api';
import { ArrowLeft, PhoneCall, AlertTriangle, CheckCircle } from 'lucide-react';

const COUNTRY_CODE = '+234';
const OTP_LENGTH = 6;

export default function VerifyPhonePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [localNumber, setLocalNumber] = useState('');
  const [fullPhone, setFullPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [step, setStep] = useState<'request' | 'sending' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPhoneVerified = !!(user?.phone && user?.auth?.phoneVerifiedAt);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const digits = localNumber.replace(/^0+/, '');
    const phone = `${COUNTRY_CODE}${digits}`;

    try {
      await apiRequest('/auth/onboarding/phone/request', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setFullPhone(phone);
      setStep('sending');
      setTimeout(() => {
        setStep('verify');
        setLoading(false);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP code.');
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`phone-otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    if (next.every((d) => d !== '')) {
      submitPhoneOtp(next.join(''));
    }
  };

  const submitPhoneOtp = async (code: string) => {
    setError(null);
    setLoading(true);
    try {
      await apiRequest('/auth/onboarding/phone/verify', {
        method: 'POST',
        body: JSON.stringify({ phone: fullPhone, code }),
      });
      await refreshUser();
      setSuccess('Phone number verified successfully!');
      setTimeout(() => {
        router.push('/profile/settings');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
      setOtp(Array(OTP_LENGTH).fill(''));
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
          <h1 className="font-heading font-bold text-lg tracking-tight">Verify Phone</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <PhoneCall className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900">Phone Verification</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {step === 'request' && 'Add your phone number to secure your account and enable OTP notifications.'}
              {step === 'sending' && 'Generating verification environment...'}
              {step === 'verify' && `Type the 6-digit OTP code sent to ${fullPhone}.`}
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
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {isPhoneVerified && step === 'request' ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50/50 p-4 text-xs text-emerald-800 border border-emerald-100 flex gap-2 items-center">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Already Verified</span>
                  <span>Your account is already linked to: {user.phone}</span>
                </div>
              </div>
              
              <button
                onClick={() => setStep('request')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          ) : (
            <>
              {step === 'request' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Mobile Phone Number</label>
                    <div className="flex rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
                      <span className="flex items-center pl-4 pr-2 text-slate-500 font-semibold text-sm border-r border-slate-100 bg-slate-50/50">
                        {COUNTRY_CODE}
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        value={localNumber}
                        onChange={(e) => setLocalNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="block w-full py-3.5 pl-3 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium"
                        placeholder="8012345678"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !localNumber}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors disabled:bg-slate-400"
                  >
                    {loading ? 'Sending request...' : 'Send Verification OTP'}
                  </button>
                </form>
              )}

              {step === 'sending' && (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
                  <p className="text-xs font-semibold text-slate-400">Requesting secure OTP code...</p>
                </div>
              )}

              {step === 'verify' && (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`phone-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        disabled={loading}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className={`h-11 w-9 rounded-lg border text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          digit ? 'border-slate-800 bg-slate-50' : 'border-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('request');
                      setOtp(Array(OTP_LENGTH).fill(''));
                    }}
                    className="w-full text-center text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Go back / edit phone number
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
