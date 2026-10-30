'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

export default function ConsentPage() {
  const [consentGranted, setConsentGranted] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('settings_consent') !== 'false';
    setConsentGranted(savedConsent);
  }, []);

  const handleToggle = (val: boolean) => {
    setConsentGranted(val);
    localStorage.setItem('settings_consent', val ? 'true' : 'false');
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
          <h1 className="font-heading font-bold text-lg tracking-tight">Consent Request</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Consent Agreement</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              By enabling the consent request, you authorize Chosen Technologies to collect, process, and securely store necessary workspace telemetry and transaction records.
            </p>
          </div>

          {saved && (
            <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100 flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Consent preferences updated successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">Workspace Compliance</span>
              <span className="text-[10px] text-slate-400">Share system diagnostic telemetry logs</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={consentGranted} 
                onChange={(e) => handleToggle(e.target.checked)} 
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
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
