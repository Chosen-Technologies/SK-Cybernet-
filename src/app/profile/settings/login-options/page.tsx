'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';

export default function LoginOptionsPage() {
  const [biometrics, setBiometrics] = useState(true);
  const [passwordLogin, setPasswordLogin] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <h1 className="font-heading font-bold text-lg tracking-tight">Login Options</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Login Configurations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Set up multi-factor and biometric configuration settings for secure workspaces.
            </p>
          </div>

          {saved && (
            <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100 flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Login preferences updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Biometric Sign-In</span>
                <span className="text-[10px] text-slate-400">Unlock using FaceID or fingerprint</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={biometrics}
                  onChange={(e) => {
                    setBiometrics(e.target.checked);
                    handleSave();
                  }}
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Password Authentication</span>
                <span className="text-[10px] text-slate-400">Allow standard credential login</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={passwordLogin}
                  onChange={(e) => {
                    setPasswordLogin(e.target.checked);
                    handleSave();
                  }}
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
          </div>

          <Link
            href="/profile/settings"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center text-sm transition-colors block"
          >
            Save and Exit
          </Link>
        </div>
      </main>
    </div>
  );
}
