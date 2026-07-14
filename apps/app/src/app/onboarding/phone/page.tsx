'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { apiRequest } from '@/lib/api';
import { Phone, CheckCircle, ArrowLeft } from 'lucide-react';

const COUNTRY_CODE = '+234';
const OTP_LENGTH = 6;

export default function PhoneOnboardingPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [localNumber, setLocalNumber] = useState('');
  const [fullPhone, setFullPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [step, setStep] = useState<'request' | 'sending' | 'verify'>('request');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      setSuccess('A verification code has been logged to the server console.');
      setStep('sending');

      setTimeout(() => {
        setStep('verify');
        setLoading(false);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP. Please try again.');
      setLoading(false);
    }
  };

  const submitOtp = async (code: string) => {
    setError(null);
    setLoading(true);

    try {
      await apiRequest('/auth/onboarding/phone/verify', {
        method: 'POST',
        body: JSON.stringify({ phone: fullPhone, code }),
      });
      await refreshUser();
      router.push('/onboarding/start');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      otpInputRefs.current[0]?.focus();
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      submitOtp(next.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => (next[i] = d));
    setOtp(next);

    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    otpInputRefs.current[lastIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      submitOtp(pasted);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          <Phone className="h-6 w-6" />
        </div>
        <h2 className="mt-3 font-heading text-2xl font-bold text-slate-900">Verify Phone Number</h2>
        <p className="mt-1 text-sm text-slate-600">
          {step === 'request' && 'Add your phone number to secure your account and enable OTP notifications.'}
          {step === 'sending' && 'Sending your verification code...'}
          {step === 'verify' && 'Enter the 6-digit verification code sent to your phone.'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100">{error}</div>
      )}

      {success && step === 'verify' && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 border border-blue-100 flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={handleRequestOtp} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Phone Number</label>
            <div className="flex rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <span className="flex items-center pl-3 pr-2 text-slate-500 font-medium text-sm border-r border-slate-200">
                {COUNTRY_CODE}
              </span>
              <input
                type="tel"
                inputMode="numeric"
                required
                value={localNumber}
                onChange={(e) => setLocalNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="block w-full rounded-r-lg py-3 pl-2 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none sm:text-sm"
                placeholder="8012345678"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">Enter your number without the country code.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none transition-colors disabled:bg-slate-400"
          >
            {loading ? 'Sending OTP...' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {step === 'sending' && (
        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Just a moment...</p>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={loading}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                className={`h-12 w-10 sm:h-14 sm:w-12 rounded-lg border text-center text-xl font-bold text-slate-900 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${
                  digit
                    ? 'border-slate-900 bg-slate-50 scale-105'
                    : 'border-slate-200 bg-white scale-100'
                }`}
              />
            ))}
          </div>

          {loading && (
            <p className="text-center text-xs font-medium text-slate-400">Verifying...</p>
          )}

          <button
            type="button"
            onClick={() => {
              setStep('request');
              setOtp(Array(OTP_LENGTH).fill(''));
              setError(null);
            }}
            className="flex w-full items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-800 py-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Change Phone Number
          </button>
        </div>
      )}
    </div>
  );
}
