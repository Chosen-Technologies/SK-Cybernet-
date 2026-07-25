'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { KeyRound, Mail, LogIn, ShieldAlert, ArrowRight, HelpCircle, X } from 'lucide-react';

interface CachedProfile {
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lock Screen States
  const [cachedProfile, setCachedProfile] = useState<CachedProfile | null>(null);
  const [pinValues, setPinValues] = useState<string[]>(['', '', '', '', '', '']);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('last_user_profile');
      if (stored) {
        try {
          setCachedProfile(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse cached profile:', e);
        }
      }
    }
  }, []);

  const handlePinChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newPinValues = [...pinValues];
    newPinValues[index] = cleanValue;
    setPinValues(newPinValues);

    // Auto-focus next input
    if (cleanValue && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!pinValues[index] && index > 0) {
        const newPinValues = [...pinValues];
        newPinValues[index - 1] = '';
        setPinValues(newPinValues);
        pinInputRefs.current[index - 1]?.focus();
      } else {
        const newPinValues = [...pinValues];
        newPinValues[index] = '';
        setPinValues(newPinValues);
      }
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newPinValues = pastedData.split('');
      setPinValues(newPinValues);
      pinInputRefs.current[5]?.focus();
    }
  };

  const handleLockScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const enteredPin = pinValues.join('');
    if (enteredPin.length !== 6) {
      setError('Please enter a 6-digit PIN.');
      return;
    }

    if (!cachedProfile?.email) {
      setError('User profile not found. Please sign in with email.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: cachedProfile.email, pin: enteredPin });
    } catch (err: any) {
      setError(err.message || 'Incorrect PIN. Please try again.');
      setLoading(false);
      setPinValues(['', '', '', '', '', '']);
      pinInputRefs.current[0]?.focus();
    }
  };

  const handleSwitchAccount = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('last_user_profile');
    }
    setCachedProfile(null);
    setPinValues(['', '', '', '', '', '']);
    setError(null);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setError('PIN must be a 6-digit numeric code.');
      return;
    }

    setLoading(true);

    try {
      await login({ email, pin });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  // Render Lock Screen if there is a cached profile
  if (cachedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

          <div className="text-center space-y-4">
            {/* Avatar / Initials Fallback */}
            <div className="flex justify-center">
              {cachedProfile.avatarUrl ? (
                <img
                  src={cachedProfile.avatarUrl}
                  alt={cachedProfile.fullName}
                  className="h-24 w-24 rounded-full object-cover border-4 border-slate-50 shadow-md transition-transform hover:scale-105 duration-300"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-md border-4 border-slate-50 transition-transform hover:scale-105 duration-300">
                  {getInitials(cachedProfile.fullName)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {cachedProfile.fullName}
              </h2>
              <p className="text-sm text-slate-500">
                Enter your 6-digit security PIN to unlock your session
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex gap-2 items-start">
              <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLockScreenSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePinPaste}>
              {pinValues.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    pinInputRefs.current[idx] = el;
                  }}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handlePinChange(e.target.value, idx)}
                  onKeyDown={(e) => handlePinKeyDown(e, idx)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all bg-slate-50 hover:bg-white focus:bg-white"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-slate-500 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Forgot PIN?
              </button>
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="text-slate-500 hover:text-indigo-600 transition-colors font-medium"
              >
                Switch account
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || pinValues.some((v) => !v)}
                className="group relative flex w-full justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md shadow-indigo-100"
              >
                {loading ? 'Unlocking...' : 'Unlock Wallet'}
              </button>
            </div>
          </form>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Forgot Your Security PIN?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For security purposes, since password resets are not handled directly inside the local lock screen, please try one of the following methods to regain access:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <li>Switch accounts and sign in with email and standard verification.</li>
                    <li>Verify via your registered backup email.</li>
                    <li>Contact support at <span className="font-semibold text-indigo-600">support@skcybernet.com</span>.</li>
                  </ul>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      handleSwitchAccount();
                    }}
                    className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-xs text-center transition-colors flex items-center justify-center gap-1"
                  >
                    Switch to Full Login
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 text-xs text-center transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access your SK Cybernet workspace wallet
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pin" className="sr-only">
                Login PIN
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="block w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm tracking-[0.5em]"
                  placeholder="6-digit PIN"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:bg-slate-400 transition-colors"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-slate-400 group-hover:text-slate-300" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">Or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="flex w-full justify-center items-center gap-2 rounded-lg border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-2.09z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
