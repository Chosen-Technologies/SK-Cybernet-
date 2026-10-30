'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Palette, CheckCircle } from 'lucide-react';

export default function ThemesPage() {
  const [theme, setTheme] = useState('light');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('settings_theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const handleSave = (val: string) => {
    setTheme(val);
    localStorage.setItem('settings_theme', val);
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
          <h1 className="font-heading font-bold text-lg tracking-tight">Themes</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Appearance Theme</h3>
            <p className="text-xs text-slate-500">
              Customize your workspace environment appearance.
            </p>
          </div>

          {saved && (
            <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100 flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Theme updated to {theme === 'light' ? 'Light Mode' : 'Dark Mode'}!</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSave('light')} 
              className={`py-4 text-xs font-bold border rounded-xl transition-all ${
                theme === 'light' 
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              ☀️ Light Mode
            </button>
            <button 
              onClick={() => handleSave('dark')} 
              className={`py-4 text-xs font-bold border rounded-xl transition-all ${
                theme === 'dark' 
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🌙 Dark Mode
            </button>
          </div>

          <Link
            href="/profile/settings"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center text-sm transition-colors block"
          >
            Go Back
          </Link>
        </div>
      </main>
    </div>
  );
}
