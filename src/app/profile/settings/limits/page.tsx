'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders } from 'lucide-react';

export default function LimitsPage() {
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
          <h1 className="font-heading font-bold text-lg tracking-tight">Transaction Limits</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Sliders className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Account Limitations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your maximum transaction volumes and capabilities based on your KYC authentication status.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
              <span className="text-slate-500">Daily Transfer Limit</span>
              <span className="font-bold text-slate-900">₦500,000.00</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
              <span className="text-slate-500">Single Transaction Limit</span>
              <span className="font-bold text-slate-900">₦100,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly Aggregate limit</span>
              <span className="font-bold text-slate-900">₦5,000,000.00</span>
            </div>
          </div>

          <Link
            href="/profile"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center text-sm transition-colors block"
          >
            Upgrade KYC to Raise Limits
          </Link>
        </div>
      </main>
    </div>
  );
}
