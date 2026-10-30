'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { 
  KeyRound, 
  Mail, 
  User, 
  ArrowLeft, 
  Building2, 
  QrCode, 
  Coins, 
  Trophy, 
  Eye, 
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';

interface CachedProfile {
  email: string;
  fullName: string;
  avatarUrl?: string;
}

const CAROUSEL_CARDS = [
  {
    title: 'Access Premium Workspaces',
    description: 'Gain instant 24/7 entry to high-speed, fully-equipped SK Cybernet workspaces near you.',
    icon: Building2,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Flexible Credit System',
    description: 'Purchase credits and pay only for the exact duration of your stay. No commitments.',
    icon: Coins,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Contactless Smart Passes',
    description: 'Generate secure digital NFC & QR passes right on your device for seamless entry.',
    icon: QrCode,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Earn Loyalty Rewards',
    description: 'Accumulate reward points with every visit, unlock achievements, and redeem free passes.',
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-600',
  },
];

export default function RegisterPage() {
  const { register, login } = useAuth();
  const router = useRouter();

  // 'onboarding' | 'signup' | 'login' | 'lockscreen'
  const [step, setStep] = useState<'onboarding' | 'signup' | 'login' | 'lockscreen'>('onboarding');
  const [activeSlide, setActiveSlide] = useState(0);

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Lockscreen State
  const [cachedProfile, setCachedProfile] = useState<CachedProfile | null>(null);
  const [pinValues, setPinValues] = useState<string[]>(['', '', '', '', '', '']);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check URL query parameters and local storage cached profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check query param for mode
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');

      // Check cached user profile
      const stored = localStorage.getItem('last_user_profile');
      let profile: CachedProfile | null = null;
      if (stored) {
        try {
          profile = JSON.parse(stored);
          setCachedProfile(profile);
        } catch (e) {
          console.error('Failed to parse cached profile:', e);
        }
      }

      if (mode === 'login') {
        if (profile) {
          setStep('lockscreen');
        } else {
          setStep('login');
        }
      }
    }
  }, []);

  // Auto-rotate carousel slides during onboarding
  useEffect(() => {
    if (step !== 'onboarding') return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_CARDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [step]);

  // Sign Up submit handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (signUpPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await register({ fullName, email: signUpEmail, password: signUpPassword });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  // Login submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginPin.length !== 6 || !/^\d+$/.test(loginPin)) {
      setError('PIN must be a 6-digit numeric code.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: loginEmail, pin: loginPin });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // Lockscreen Pin Handlers
  const handlePinChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newPinValues = [...pinValues];
    newPinValues[index] = cleanValue;
    setPinValues(newPinValues);

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
    setStep('login');
  };

  const handleGoogleAuth = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    window.location.href = `${apiBaseUrl}/auth/google`;
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

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. ONBOARDING STATE */}
      {step === 'onboarding' && (
        <div className="flex flex-1 flex-col justify-between px-6 py-10 max-w-md mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col items-center pt-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.15)] animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold tracking-wider uppercase text-white">
              SK Cybernet
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              Workspace Access Hub
            </p>
          </div>

          {/* Sliding Carousel Card */}
          <div className="relative my-auto py-8 overflow-hidden w-full min-h-[300px] flex flex-col justify-center">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {CAROUSEL_CARDS.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div key={idx} className="w-full flex-shrink-0 flex flex-col items-center px-4 text-center">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr ${card.gradient} text-white shadow-lg mb-6 transform transition-transform duration-300 hover:scale-105`}>
                      <CardIcon className="h-10 w-10" />
                    </div>
                    <h2 className="text-xl font-bold text-white font-heading tracking-tight mb-3">
                      {card.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {CAROUSEL_CARDS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="space-y-4 pt-4">
            <button
              onClick={() => {
                setError(null);
                setStep('signup');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-4 px-4 text-sm font-semibold text-white transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)]"
            >
              Open an Account
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="text-sm text-slate-400">Already have an account? </span>
              <button
                onClick={() => {
                  setError(null);
                  if (cachedProfile) {
                    setStep('lockscreen');
                  } else {
                    setStep('login');
                  }
                }}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGN UP FORM STATE */}
      {step === 'signup' && (
        <div className="flex flex-1 flex-col justify-between px-6 py-8 max-w-md mx-auto w-full">
          {/* Header & Back Action */}
          <div>
            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={() => setStep('onboarding')}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Go back to onboarding"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold text-white font-heading tracking-wide uppercase">
                Create Account
              </h2>
              <div className="w-10 h-10" />
            </div>

            <p className="text-sm text-slate-400 mt-6 text-center">
              Let's set up your profile and get you access to flexible workspaces.
            </p>

            {error && (
              <div className="mt-6 rounded-xl bg-red-950/50 border border-red-500/30 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSignUpSubmit}>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="full-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="full-name"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 py-3.5 pl-10 pr-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 py-3.5 pl-10 pr-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <KeyRound className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 py-3.5 pl-10 pr-10 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full justify-center rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-4 px-4 text-sm font-semibold text-white transition-all shadow-[0_4px_20px_rgba(37,99,235,0.2)] disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-widest">Or Register With</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="flex w-full justify-center items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 py-3.5 px-4 text-sm font-medium text-slate-200 hover:bg-slate-700/85 hover:text-white transition-all shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-2.09z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="text-center pt-8">
            <span className="text-sm text-slate-400">Already have an account? </span>
            <button 
              onClick={() => {
                setError(null);
                if (cachedProfile) {
                  setStep('lockscreen');
                } else {
                  setStep('login');
                }
              }}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* 3. SIGN IN / LOGIN STATE */}
      {step === 'login' && (
        <div className="flex flex-1 flex-col justify-between px-6 py-8 max-w-md mx-auto w-full">
          {/* Header & Back Action */}
          <div>
            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={() => setStep('onboarding')}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Go back to onboarding"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold text-white font-heading tracking-wide uppercase">
                Welcome Back
              </h2>
              <div className="w-10 h-10" />
            </div>

            <p className="text-sm text-slate-400 mt-6 text-center">
              Access your SK Cybernet workspace wallet.
            </p>

            {error && (
              <div className="mt-6 rounded-xl bg-red-950/50 border border-red-500/30 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                {/* Email Address */}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 py-3.5 pl-10 pr-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Login PIN */}
                <div>
                  <label htmlFor="login-pin" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Login PIN
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <KeyRound className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="login-pin"
                      name="pin"
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 py-3.5 pl-10 pr-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm tracking-[0.5em] transition-all"
                      placeholder="6-digit PIN"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full justify-center rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-4 px-4 text-sm font-semibold text-white transition-all shadow-[0_4px_20px_rgba(37,99,235,0.2)] disabled:bg-slate-700 disabled:text-slate-400"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-widest">Or Connect With</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="flex w-full justify-center items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 py-3.5 px-4 text-sm font-medium text-slate-200 hover:bg-slate-700/85 hover:text-white transition-all shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-2.09z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="text-center pt-8">
            <span className="text-sm text-slate-400">Don&apos;t have an account? </span>
            <button 
              onClick={() => {
                setError(null);
                setStep('signup');
              }}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* 4. LOCK SCREEN STATE */}
      {step === 'lockscreen' && cachedProfile && (
        <div className="flex flex-1 flex-col justify-between px-6 py-8 max-w-md mx-auto w-full">
          <div>
            <div className="text-center space-y-6 pt-10">
              {/* Avatar */}
              <div className="flex justify-center">
                {cachedProfile.avatarUrl ? (
                  <img
                    src={cachedProfile.avatarUrl}
                    alt={cachedProfile.fullName}
                    className="h-24 w-24 rounded-3xl object-cover border-4 border-slate-800 shadow-xl transition-transform hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-xl border-4 border-slate-800 transition-transform hover:scale-105 duration-300">
                    {getInitials(cachedProfile.fullName)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-white">
                  Welcome back, {cachedProfile.fullName}
                </h2>
                <p className="text-sm text-slate-400 max-w-[280px] mx-auto">
                  Enter your 6-digit security PIN to unlock your session
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-950/50 border border-red-500/30 p-4 text-sm text-red-300 flex gap-2 items-start">
                <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
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
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-700/80 bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-white"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center text-xs px-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-slate-400 hover:text-blue-400 transition-colors font-medium flex items-center gap-1"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Forgot PIN?
                </button>
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="text-slate-400 hover:text-blue-400 transition-colors font-medium"
                >
                  Switch account
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || pinValues.some((v) => !v)}
                className="group relative flex w-full justify-center rounded-xl bg-blue-600 py-4 px-4 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 transition-all shadow-md"
              >
                {loading ? 'Unlocking...' : 'Unlock Wallet'}
              </button>
            </form>
          </div>

          {/* Forgot Password Modal */}
          {showForgotModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-200">
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Forgot Your Security PIN?</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      For safety and privacy, PIN resets must be initiated through support or account verification:
                    </p>
                    <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <li>Switch accounts to sign in with email and a PIN request link.</li>
                      <li>Check your verification message for reset instructions.</li>
                      <li>Contact workspace support at <span className="font-semibold text-blue-400">support@skcybernet.com</span>.</li>
                    </ul>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowForgotModal(false);
                        handleSwitchAccount();
                      }}
                      className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Use Full Login
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold py-3 text-xs text-center transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
