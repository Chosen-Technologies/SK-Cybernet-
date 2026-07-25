'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { 
  ArrowLeft, 
  ChevronRight, 
  Lock, 
  KeyRound, 
  Smartphone, 
  Sliders, 
  Users, 
  PhoneCall, 
  FileText, 
  Palette, 
  Globe, 
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    setTheme(localStorage.getItem('settings_theme') || 'light');
    setLanguage(localStorage.getItem('settings_lang') || 'English');
  }, []);

  const isPhoneVerified = !!(user?.phone && user?.auth?.phoneVerifiedAt);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <Link 
            href="/profile"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-bold text-lg tracking-tight font-sans">Settings</h1>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* SECURITY & PRIVACY */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/70 border-b border-slate-100 px-5 py-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security & Privacy</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {/* 1. Change Passcode (6-digits) */}
            <Link 
              href="/profile/settings/passcode"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Lock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Change Passcode (6-Digits)</span>
                  <span className="text-[10px] text-slate-400">Configure/Update your mobile access passcode</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {user?.auth?.loginPinSetAt ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Configured</span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Missing</span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </Link>

            {/* 2. Set User PIN (4-digits) */}
            <Link 
              href="/profile/settings/pin"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Set User PIN (4-Digits)</span>
                  <span className="text-[10px] text-slate-400">Secure transaction authorizations</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {user?.auth?.paymentPinSetAt ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Configured</span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Missing</span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </Link>

            {/* 3. Login Options */}
            <Link 
              href="/profile/settings/login-options"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Login Options</span>
                  <span className="text-[10px] text-slate-400">Manage biometrics and authentication preferences</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/70 border-b border-slate-100 px-5 py-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transactions</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {/* 1. Phone Number Account (Verify) */}
            <Link 
              href="/profile/settings/phone"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Phone Number Account</span>
                  <span className="text-[10px] text-slate-400">{user?.phone || 'Verify your mobile number to link account'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isPhoneVerified ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Verified</span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Verify Now</span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </Link>

            {/* 2. Transaction Limits */}
            <Link 
              href="/profile/settings/limits"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Sliders className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Transaction Limits</span>
                  <span className="text-[10px] text-slate-400">View and adjust daily transactional thresholds</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>

            {/* 3. Beneficiaries */}
            <Link 
              href="/profile/settings/beneficiaries"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Beneficiaries</span>
                  <span className="text-[10px] text-slate-400">Manage saved payment accounts</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>

            {/* 4. USSD Banking */}
            <Link 
              href="/profile/placeholder?title=USSD+Banking"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">USSD Banking</span>
                  <span className="text-[10px] text-slate-400">Under construction</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Soon</span>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </Link>
          </div>
        </div>

        {/* OTHERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/70 border-b border-slate-100 px-5 py-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Others</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {/* 1. Consent Request */}
            <Link 
              href="/profile/settings/consent"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Consent Request</span>
                  <span className="text-[10px] text-slate-400">Review platform policies and compliance agreements</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>

            {/* 2. Themes */}
            <Link 
              href="/profile/settings/themes"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Palette className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Themes</span>
                  <span className="text-[10px] text-slate-400">Change appearance ({theme === 'light' ? 'Light Mode' : 'Dark Mode'})</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>

            {/* 3. Languages */}
            <Link 
              href="/profile/settings/languages"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 text-left"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Languages</span>
                  <span className="text-[10px] text-slate-400">Set system language ({language})</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>

            {/* 4. Delete Account */}
            <Link 
              href="/profile/settings/delete-account"
              className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 transition-colors text-red-600 text-left"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-red-700 block">Delete Account</span>
                  <span className="text-[10px] text-red-500/80">Permanently close workspace wallet</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-red-500 shrink-0" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
